
/**
 * Module dependencies.
 */

var proto = require('./lib/proto')
  , statics = require('./lib/static')
  , Emitter = 'undefined' == typeof window ? require('emitter-component') : require('emitter')

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
    
    // XXX: tmp
    //if ('function' === typeof fn) {
    //  this.on('execute', function(){
    //    console.log('exec!')
    //  });
    //  this.on('open', function(context, data, fn){
    //    console.log('asdf', data, fn);
    //    fn();
    //  });
    //}
  }

  // statics

  Stream.className = Stream.id = name;

  for (var key in statics) Stream[key] = statics[key];

  // prototype

  Stream.prototype = {};
  Stream.prototype.constructor = Stream;
  
  for (var key in proto) Stream.prototype[key] = proto[key];

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
  emitter.off('execute');
  emitter.off('close');

  delete lookup[emitter.id];
}