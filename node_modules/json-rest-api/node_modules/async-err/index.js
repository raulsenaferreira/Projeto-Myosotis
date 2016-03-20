'use strict';
var debug = require('debug')('async-err');
var util = require('util');
var is = require('is2');

module.exports.asyncerr = asyncerr;
module.exports.asyncerrThrows = asyncerrThrows;

var BAD_ERR_ERR = 'async-err received bad err object.';
var BAD_CB_ERR = 'async-err received bad callback: ';

/**
 * A convenience function to make otherwise sync errors async. If you give
 * asyncerr incorrect arguments, it will send messages to the console via the
 * debug module, but that's it.
 * @param {Object} err A Node.js Error object.
 * @param {Function} cb A function object as callback.
 */
function asyncerr(err, cb) {
  if (!util.isError(err, Error))
    return debug(BAD_ERR_ERR);

  if (typeof err.message === 'string' && err.message.length)
    debug(err.message);

  if (typeof err.stack === 'object')
    debug(err.stack);

  if (!is.func(cb))
    return debug(BAD_CB_ERR+util.inspect(cb));

  // call the callback on the next tick of the event loop
  process.nextTick(function() {
    cb(err);
  });
}

/**
 * A convenience function to make otherwise sync errors async. If you give it
 * incorrect arguments, it will throw and exception.
 * @param {Object} err A Node.js Error object.
 * @param {Function} cb A function object as callback.
 */
function asyncerrThrows(err, cb) {
  if (!util.isError(err))
    throw new Error(BAD_ERR_ERR);

  if (typeof err.message === 'string' && err.message.length)
    debug(err.message);

  if (typeof err.stack === 'object')
    debug(err.stack);

  if (!is.func(cb))
    throw new Error(BAD_CB_ERR+util.inspect(cb));

  // call the callback on the next tick of the event loop
  process.nextTick(function() {
    cb(err);
  });
}

