'use strict';
var request = require('request');
var inspect = require('util').inspect;
var debug = require('debug')('json-rest-api:example:client');
var assert = require('assert');


request({json:true, uri: 'http://localhost:8000/ping'}, function(err, res, json) {
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
