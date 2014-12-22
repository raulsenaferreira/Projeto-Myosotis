/**
 * @fileOverview
 * Implements a simple REST API in an object. Requests and responses are in
 * JSON. Or are supposed to be.
 */
'use strict';
var http = require('http');
var debug = require('debug')('json-rest-api');
var url = require('url');
var util = require('util');
var inspect = util.inspect;
var is = require('is2');
var asyncerr = require('async-err');

// set a default port to listen for requests
var DEFAULT_PORT = process.env.PORT ? process.env.PORT : 44401;

module.exports = RestApi;

/**
 * RestApi constructor. Creates the HTTP server objects and starts listening on
 * the socket.
 * @param {Object} [config] An optional configuration object to configure the
 * RestApi. Possible properties are: port and bindTo to specify the listening
 * port and the address to bind to. If no port is specified the default is 44401
 * and the default address is INADDR_ANY.
 * @param {Function} [cb] An optional callback. If there is a callback, the
 * process will be begin listening on the socket for HTTP requests.
 * @constructor
 */
function RestApi(config, cb) {
    var self = this;
    self.routes = {};

    self.bindTo = (config && config.bindTo) ? config.bindTo : undefined;
    self.port = (config && config.port) ? config.port : DEFAULT_PORT;

    // create the HTTP server object and on every request, try to match the
    // request with a known route. If there is no match, return a 404 error.
    self.HttpServer = http.createServer(function(req, res) {
        var uriPath;
        var queryStr;
        var urlParts = url.parse(req.url, true);
        if (is.obj(urlParts)) {
            uriPath = urlParts.pathname || undefined;
            queryStr = urlParts.query || undefined;
            debug('queryStr: '+inspect(queryStr));
        } else {
            // no match was found, return a 404 error.
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end('{status:400, message:"Bad URI path."}', 'utf8');
            return;
        }

        // try to match the request & method with a handler
        for (var path in self.routes[req.method]) {
            if (path === uriPath) {
                self.routes[req.method][path](req, res, queryStr);
                return;
            }
        }

        // no match was found, return a 404 error.
        res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
        res.end('{status:404, message:"Content not found."}', 'utf8');
    });

    if (cb) self.listen(cb);
}

/**
 * Start listening on the socket for HTTP requests.
 * @param {Function} [cb] An optional callback called when the server is ready.
 */
RestApi.prototype.listen = function(cb) {
    var self = this;

    self.HttpServer.listen(self.port, self.bindTo, function(err) {
        if (err)    {
            var errStr = 'RestApi error: '+inspect(err);
            debug(errStr);
            if (cb)
                return cb(new Error(errStr));
            else
                return;
        }
        debug('REST API listening on port: '+self.port);
        if (cb)    cb();
    });
};

/**
 * Stops the server from acccepting new connections and listening on the port.
 * @param {Function} [cb] The callback function. Optional.
 */
RestApi.prototype.stop = function(cb) {
    var self = this;

    if (!is.obj(self.HttpServer))
        return asyncerr(new Error('There server is not running.'), cb);

    self.HttpServer.close(function(err) {
        if (err && cb) return cb(err);
        if (cb) return cb();
    });
};

/**
 * Add a route along with a function to run.
 * @param {String} verb HTTP verb for route.
 * @param {String} path A valid URI path.
 * @param {Function} func A function to run when the path executes.
 * @return {Boolean|Error} True, if no errors on the parameters, Error
 * otherwise.
 * @return {Error|Boolean} true on success and Error on failure.
 */
RestApi.prototype.addRoute = function(verb, path, func) {
    var self = this;

    if (!is.nonEmptyStr(verb))
        return new Error('Bad verb: '+inspect(verb));

    if (!is.nonEmptyStr(path))
        return new Error('RestApi.addRoute bad path: '+inspect(path));

    if (!is.func(func))
        return new Error('RestApi.prototype.addRoute bad func: '+inspect(func));

    var httpVerb = verb.toUpperCase();
    debug('Adding: '+httpVerb+' '+path);
    if (!self.routes[httpVerb])    self.routes[httpVerb] = {};

    // Create a handling function for the route that gathers the
    // the HTTP request body and passes that on.
    self.routes[httpVerb][path] = function(req, res, queryStr) {
        var body = '';     // buffer for body.

        // collect the body in buf;
        req.on('data', function (data) { body += data.toString(); });

        // we have the body & header, now process.
        req.on('end', function () {
            req.body = body;
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;

            // there may not be a body
            if (body.length === 0)
                return func(req, res, {}, queryStr);

            // there is a body, make sure it is valid, parsable JSON
            var jsonBody;
            try {
                jsonBody = JSON.parse(body);
            } catch (err) {
                debug('Error parsing JSON body:',body);
                res.statusCode = 400;
                res.end('{"success": false, "msg": "Bad request."}', 'utf8');
                return;
            }
            func(req, res, jsonBody, queryStr);
        });
    };
    return true;
};

/**
 * A method for the JsonServerResponse prototype to send json by passing an
 * object.    Usage:    res.json([status|body], [body])
 * @param {Number|Object} Optional. First argument may be either the status
 * code or the object to stringify into JSON.
 * @param {Object} Optional. If the first object is the status code, then the
 * second optional argument, if present, is an object to serialize into JSON.
 * @return {Boolean} true on success, false otherwise.
 */
http.ServerResponse.prototype.json = function(obj) {

    if (arguments.length === 2) {
        if (typeof arguments[1] === 'number') {
            this.statusCode = arguments[1];
        } else {
            this.statusCode = obj;
            obj = arguments[1];
        }
    }

    if (!is.obj(obj)) {
        debug('http.ServerResponse.json bad object param: '+inspect(obj));
        return false;
    }

    if (!is.positiveInt(this.statusCode)) {
        debug('http.ServerResponse.json bad status param: '+
              inspect(this.statusCode));
        return false;
    }

    var str;
    try {
        str = JSON.stringify(obj);
    } catch (err) {
        debug('Error parsing JSON body: '+inspect(obj));
        debug('Error err: '+inspect(err));
        return false;
    }

    this.writeHead(this.statusCode, {'Content-Type': 'application/json'});
    this.end(str, 'utf8');
    return true;
};
