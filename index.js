
/**
 * Module dependencies.
 */

var load = require('tower-load')
  , proto = require('./lib/proto')
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
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

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

/**
 * Lazy-load.
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
}

/**
 * Check if `stream` exists by `name`.
 *
 * @param {String} name
 */

exports.exists = function(name){
  // try lazy loading
  if (undefined === exports.collection[name])
    return !!exports.load(name);

  return !!exports.collection[name];
}