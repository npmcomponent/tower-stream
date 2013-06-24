
/**
 * Module dependencies.
 */

var load = require('tower-load');
var proto = require('./lib/proto');
var statics = require('./lib/static');
var api = require('./lib/api');

/**
 * Expose `stream`.
 */

exports = module.exports = stream;

/**
 * Find or create a stream by `name`.
 *
 * @param {String} name A stream name.
 * @param {Function} fn Function called on stream execution.
 * @api public
 */

function stream(name, fn) {
  if (exports.collection[name]) return exports.collection[name];
  if (exports.load(name)) return exports.collection[name];

  /**
   * Class representing a stream.
   *
   * @class
   * @param {Object} options Stream options.
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
 *
 * @param {String} ns A namespace.
 * @return {Function} The `stream` API function extended under a namespace.
 * @api public
 */

exports.ns = function(ns){
  function stream(name, fn) {
    return exports(ns + '.' + name, fn);
  }

  api.extend(stream, exports);

  stream.exists = function(name){
    return exports.exists(ns + '.' + name);
  }

  return stream;
};

/**
 * Lazy-load.
 * 
 * @param {String} name A unique key such as a stream name.
 * @param {Path} path Full `require.resolve(x)` path.
 * @return {Function} A module.
 * @api public
 */

exports.load = function(name, path){
  return 1 === arguments.length
    ? load(exports, name)
    : load.apply(load, [exports].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Check if `stream` exists by `name`.
 *
 * @param {String} name A stream name.
 * @return {Boolean} true if the stream exists, else false.
 * @api public
 */

exports.exists = function(name){
  // try lazy loading
  if (undefined === exports.collection[name])
    return !!exports.load(name);

  return !!exports.collection[name];
};