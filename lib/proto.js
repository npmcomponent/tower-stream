
/**
 * Execute the stream.
 */

exports.execute = function(fn){
  this.constructor.emit('execute', this, fn);
}

/**
 * Close the stream.
 */

exports.close = function(fn){
  this.constructor.emit('close', this, fn);
}