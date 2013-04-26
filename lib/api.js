
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');

/**
 * Expose `constructorFn`
 */

exports = module.exports = api;

/**
 * Setup the DSL API for a library.
 *
 * This is called once per "apiFn method".
 */

function api(apiFn, statics, proto){
  apiFn.constructors = [];

  // mixin `Emitter`

  Emitter(apiFn);
  Emitter(statics);
  Emitter(proto);

  apiFn.clear = clear.bind(apiFn);
  apiFn.remove = remove.bind(apiFn);

  return apiFn;
}

/**
 * Add base behavior to a `Function`.
 *
 * This is called inside the API method.
 */

exports.init = function(name, fn, statics, proto, apiFn){
  fn.id = name;

  // namespace

  fn.ns = name.replace(/\.\w+$/, '');

  // statics

  for (var key in statics) fn[key] = statics[key];

  // prototype

  fn.prototype = {};
  fn.prototype.constructor = fn;
  
  for (var key in proto) fn.prototype[key] = proto[key];

  apiFn.constructors[name] = fn;
  apiFn.constructors.push(fn);

  return apiFn;
}

/**
 * Emit events for the `name`,
 * so that external libraries can add extensions.
 */

exports.dispatch = function(apiFn, name, fn){
  var parts = name.split('.');

  for (var i = 0, n = parts.length; i < n; i++) {
    apiFn.emit('define ' + parts.slice(0, i).join('.'), fn);
  }

  apiFn.emit('define', fn);

  return apiFn;
}

/**
 * Scope the `constructorFn` names under a namespace.
 */

exports.extend = function(childApi, parentApi){
  // XXX: copy functions?
  for (var key in parentApi) {
    if ('function' === typeof parentApi[key])
      childApi[key] = parentApi[key];
  }
  return childApi;
}

/**
 * Clear API behavior.
 */

function clear(){
  // remove all listeners
  this.off();

  while (this.constructors.length)
    this.remove(this.constructors.pop());

  return this;
}

function remove(val, i){
  var emitter = this.constructors[val] || val;
  emitter.off();
  delete this.constructors[emitter.id];
  // XXX: delete from constructors array.
}