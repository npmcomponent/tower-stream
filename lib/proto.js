
/**
 * Module dependencies.
 */

var noop = function(){}; // XXX: temp until async emitter.

/**
 * Execute the stream.
 */

exports.exec = function(data, fn){
  this.constructor.emit('exec', this, data, fn || noop);
  // XXX: need to handle with/without cases.
  //if (fn) fn();
};

/**
 * Open the stream.
 */

exports.open = function(data, fn){
  // XXX: refactor
  if (this.constructor.hasListeners('open'))
    this.constructor.emit('open', this, data, fn || noop);
  if (this.hasListeners('open'))
    this.emit('open', fn || noop);

  if (!this.hasListeners('open') && !this.constructor.hasListeners('open'))
    fn();
};

/**
 * Close the stream.
 */

exports.close = function(fn){
  this.constructor.emit('close', this, fn);
  this.emit('close', fn);
};