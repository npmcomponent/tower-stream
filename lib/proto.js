
/**
 * Execute the stream.
 */

exports.execute = function(data, fn){
  this.constructor.emit('execute', this, data, fn);
}

/**
 * Close the stream.
 */

exports.close = function(fn){
  this.constructor.emit('close', this, fn);
}