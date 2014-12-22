'use strict';
var is = require('is2');
var async = require('async');
var asyncerrThrows = require('../index').asyncerrThrows;

function try1(cb) {
  try {
    return asyncerrThrows('This is not valid.', cb);
  } catch (err) {
    var re = /^async-err received bad err object./;
    var match = err.message.match(re);
    if (is.array(match) && match.length > 0)
      return cb();
    return cb('Bad error: '+err.message);
  }
  cb(new Error('No exception received.'));
}

describe('asyncerrThrows', function() {
  it('Should throw an exception if not given Error obj.', function(cb) {
    async.series([try1], function(err) {
      if (err)  return cb(err);
      cb();
    });
  });
});

function try2(cb) {
  try {
    return asyncerrThrows(new Error('This is valid.'), undefined);
  } catch (err) {
    var re = /^async-err received bad callback: /;
    var match = err.message.match(re);
    if (is.array(match) && match.length > 0)
      return cb();
    return cb('Bad error: '+err.message);
  }
  cb(new Error('No exception received.'));
}

describe('asyncerrThrows', function() {
  it('Should throw an exception if not given callabck.', function(cb) {
    async.series([try2], function(err) {
      if (err)  return cb(err);
      cb();
    });
  });
});

