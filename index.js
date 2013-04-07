
/**
 * Module dependencies.
 */

var _stream = require('stream')
  , ReadableStream = _stream.Readable
  , proto = require('./lib/proto')
  , statics = require('./lib/static')
  , Emitter = 'undefined' == typeof window ? require('emitter-component') : require('emitter')

/**
 * Expose `stream`.
 */

var exports = module.exports = stream;

/**
 * A one-liner.
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function stream(name) {
  if (constructors[name]) return constructors[name];

  /**
   * Initialize a new `Stream`.
   *
   * @api public
   */

  function Stream() {
    this.name = name;
    Stream.emit('init', this);
  }

  // mixin emitter

  Emitter(Stream);

  // statics

  Stream.className = Stream.id = name;

  for (var key in statics) Stream[key] = statics[key];

  // prototype

  Stream.prototype = {};
  Stream.prototype.constructor = Stream;
  Emitter(Stream.prototype);
  
  for (var key in proto) Stream.prototype[key] = proto[key];

  constructors[name] = Stream;
  constructors.push(Stream);
  stream.emit('define', Stream);

  return Stream;
}

/**
 * Stream classes.
 */

var constructors = stream.constructors = [];

/**
 * Mixin `Emitter`.
 */

Emitter(stream);

/**
 * Clear `stream.constructors`.
 */

exports.clear = function(){
  constructors.length = 0;
  return exports;
}