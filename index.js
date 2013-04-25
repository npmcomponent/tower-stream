
/**
 * Module dependencies.
 */

var proto = require('./lib/proto')
  , statics = require('./lib/static')
  , Emitter = require('tower-emitter');

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
  if (lookup[name]) return lookup[name];

  /**
   * Initialize a new `Stream`.
   *
   * @api public
   */

  function Stream(options) {
    options || (options = {});

    for (key in options) this[key] = options[key];

    this.name = name;
    this.inputs = options.inputs || [];
    this.outputs = options.outputs || [];
    Stream.emit('init', this);
  }

  // statics

  Stream.className = Stream.id = name;

  for (var key in statics) Stream[key] = statics[key];

  // prototype

  Stream.prototype = {};
  Stream.prototype.constructor = Stream;
  // so you can chain
  var ns = name.split('.');
  ns = ns.pop() && ns.join('.');
  // XXX: refactor to a better way
  Stream.action = function(x, fn){
    return stream(ns + '.' + x, fn);
  }
  
  for (var key in proto) Stream.prototype[key] = proto[key];

  if ('function' === typeof fn) {
    Stream.on('exec', fn);
  }

  lookup[name] = Stream;
  constructors.push(Stream);
  stream.emit('define', Stream);

  return Stream;
}

/**
 * Stream classes.
 */

var constructors = stream.constructors = []
  , lookup = {};

exports.ns = function(ns){
  function stream(name) {
    return exports(ns + '.' + name);
  }

  // XXX: copy functions?
  for (var key in exports) {
    if ('function' === typeof exports[key])
      stream[key] = exports[key];
  }
  return stream;
}

/**
 * Mixin `Emitter`.
 */

Emitter(stream);
Emitter(statics);
Emitter(proto);

/**
 * Clear `stream.constructors`.
 */

exports.clear = function(){
  exports.off('define');

  while (constructors.length)
    exports.remove(constructors.pop());

  return exports;
}

exports.remove = function(val){
  var emitter = lookup[val] || val;

  emitter.off('init');
  emitter.off('data');
  emitter.off('exec');
  emitter.off('close');

  delete lookup[emitter.id];
}