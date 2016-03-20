'use strict';
var request = require('request');
var inspect = require('util').inspect;
var debug = require('debug')('json-rest-api:example:client');
var assert = require('assert');

var data = {
    field1: 'Edmond',
    field2: 100,
    field3: {
        alpha: true,
        beta: [ 0, 1, 2 ],
        gamma: 999
    }
};

request({method:'POST', json:data, uri: 'http://localhost:8000/postData'}, function(err, res, json) {
    if (err) {
        debug('Error: '+inspect(err));
        return;
    }
    debug('typeof json: '+typeof json);
    debug('json: '+inspect(json));
    assert.ok(json.success === true);
    assert.ok(json.pong === 'pong');
    console.log('Success!');
});
