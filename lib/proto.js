
/**
 * Module dependencies.
 */

var noop = function(){} // XXX: temp until async emitter.

/**
 * Execute the stream.
 */

exports.execute = function(data, fn){
  this.constructor.emit('execute', this, data, noop);
  // XXX: need to handle with/without cases.
  //if (fn) fn();
}

/**
 * Close the stream.
 */

exports.close = function(fn){
  this.constructor.emit('close', this, fn);
  this.emit('close', fn);
}