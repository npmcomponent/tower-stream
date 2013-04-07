
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

module.exports = stream;

/**
 * A one-liner.
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function stream(name) {
  if (streams[name]) return streams[name];

  /**
   * Initialize a new `Stream`.
   *
   * @api public
   */

  function Stream() {
    this.name = name;
    this.emit('init', this);
  }

  // mixin emitter

  Emitter(Stream);

  // statics

  Stream.className = Stream.id = name;
  Stream.attrs = [];

  for (var key in statics) Stream[key] = statics[key];

  // prototype

  Stream.prototype = {};
  Stream.prototype.constructor = Stream;
  
  for (var key in proto) Stream.prototype[key] = proto[key];

  streams[name] = Stream;
  streams.push(Stream);
  stream.emit('define', Stream);

  return Stream;
}

/**
 * Stream classes.
 */

var streams = stream.streams = [];

/**
 * Mixin `Emitter`.
 */

Emitter(stream);