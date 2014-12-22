'use strict';
var JsonRestApi = require('./index');
var request = require('request');
var inspect = require('util').inspect;
var debug = require('debug')('json-rest-api:test');
var assert = require('assert');

describe('Test1', function() {
    var RestApi;
    before(function(cb) {
        RestApi = new JsonRestApi({port: 8000}, function(err) {
            debug('IN CB');
            if (err) {
                debug('/ping error: '+inspect(err));
                return cb(err);
            }
            // add a route
            // A simple health check, common to all derived classes.
            RestApi.addRoute('get', '/ping', function(req, res) {
                res.json({success: true, pong: 'pong'});
            });
            cb();
        });
    });

    it('should fetch test.html', function(cb) {
        request({json:true, uri: 'http://localhost:8000/ping'}, function(err, res, json) {
            if (err) {
                debug('Error: '+inspect(err));
                return cb(err);
            }
            debug('typeof json: '+typeof json);
            debug('json: '+inspect(json));
            assert.ok(json.success === true);
            assert.ok(json.pong === 'pong');
            cb();
        });
    });

    after(function(cb){
        RestApi.stop(function(err) {
            if (err)    return cb(err);
            debug('RestApi stopped successfully');
            cb();
        });
    });
});

describe('Test2', function() {
    var RestApi;
    before(function(cb) {
        RestApi = new JsonRestApi({port: 8000}, function(err) {
            debug('IN CB');
            if (err) {
                debug('/ping error: '+inspect(err));
                return cb(err);
            }
            // add a route
            // A simple health check, common to all derived classes.
            RestApi.addRoute('get', '/setname', function(req, res, json, qs) {
                debug('qs: '+inspect(qs));
                res.json({success: true, cmd: 'setname', qs: qs});
            });
            cb();
        });
    });

    it('should be able receive a query string', function(cb) {
        var qs = {
            alpha: 'one',
            beta: 2,
            gamma: true
        };
        var opts = {
            json: true,
            uri: 'http://localhost:8000/setname',
            qs: qs
        };
        request(opts, function(err, res, json) {
            if (err) {
                debug('Error: '+inspect(err));
                return cb(err);
            }
            debug('typeof json: '+typeof json);
            debug('json: '+inspect(json));
            assert.ok(json.success === true);
            assert.ok(json.cmd === 'setname');
            var qsRet = {'alpha': 'one', 'beta': '2', 'gamma': 'true'};
            assert.deepEqual(qsRet, json.qs);
            cb();
        });
    });

    after(function(cb){
        RestApi.stop(function(err) {
            if (err)    return cb(err);
            debug('RestApi stopped successfully');
            cb();
        });
    });
});
