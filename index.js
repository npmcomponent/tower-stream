
/**
 * Module dependencies.
 */

var proto = require('./lib/proto')
  , statics = require('./lib/static')
  , api = require('./lib/api');

/**
 * Expose `stream`.
 */

exports = module.exports = stream;

/**
 * Find or create a stream by `name`.
 *
 * @param {String} name
 * @param {Function} [fn]
 */

function stream(name, fn) {
  if (exports.constructors[name]) return exports.constructors[name];

  /**
   * Initialize a new `Stream`.
   *
   * @api public
   */

  function Stream(options) {
    options || (options = {});

    for (var key in options) this[key] = options[key];

    this.name = name;
    this.inputs = options.inputs || [];
    this.outputs = options.outputs || [];
    Stream.emit('init', this);
  }

  api.init(name, Stream, statics, proto, stream);

  Stream.action = function(x, fn){
    return stream(Stream.ns + '.' + x, fn);
  }

  if ('function' === typeof fn) Stream.on('exec', fn);

  api.dispatch(stream, name, Stream);

  return Stream;
}

/**
 * Mixin API behavior.
 */

api(exports, statics, proto);

/**
 * Extend the `stream` API under a namespace.
 */

exports.ns = function(ns){
  function stream(name, fn) {
    return exports(ns + '.' + name, fn);
  }

  return api.extend(stream, exports);
}