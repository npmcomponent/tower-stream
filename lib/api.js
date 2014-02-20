
/**
 * Module dependencies.
 */

// commented out by npm-component: var Emitter = require('tower-emitter');

/**
 * Expose `constructorFn`
 */

exports = module.exports = api;

/**
 * Setup the DSL API for a library.
 *
 * This is called once per "apiFn method".
 *
 * @param {Function} apiFn An api.
 * @param {Function} statics Module containing static functions to attach to `apiFn`.
 * @param {Function} proto Module containing instance functions to attach to `apiFn`.
 * @return {Function} The api `apiFn`.
 */

function api(apiFn, statics, proto){
  apiFn.collection = [];

  // mixin `Emitter`

  Emitter(apiFn);
  Emitter(statics);
  Emitter(proto);

  apiFn.clear = clear;//clear.bind(apiFn);
  apiFn.remove = remove;//remove.bind(apiFn);

  return apiFn;
}

/**
 * Add base behavior to a `Function`.
 *
 * This is called inside the API method.
 *
 * @param {String} name `fn` id.
 * @param {Function} fn A function.
 * @param {Function} statics Module containing static functions to attach to `fn`.
 * @param {Function} proto Module containing instance functions to attach to `fn`.
 * @param {Function} apiFn An api.
 * @return {Function} The api `apiFn`.
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

  apiFn.collection[name] = fn;
  apiFn.collection.push(fn);

  return apiFn;
};

/**
 * Emit events for the `name`,
 * so that external libraries can add extensions.
 *
 * @param {Function} apiFn An api.
 * @param {String} name A name.
 * @param {Function} fn Function called on `apiFn` define event.
 * @return {Function} The api `apiFn`.
 */

exports.dispatch = function(apiFn, name, fn){
  var parts = name.split('.');

  for (var i = 1, n = parts.length + 1; i < n; i++) {
    apiFn.emit('define ' + parts.slice(0, i).join('.'), fn);
  }

  apiFn.emit('define', fn);

  return apiFn;
};

/**
 * Scope the `constructorFn` names under a namespace.
 *
 * @param {Function} childApi The api to copy functions to.
 * @param {Function} parentApi The api to copy functions from.
 * @return {Function} The api `childApi`.
 */

exports.extend = function(childApi, parentApi){
  // XXX: copy functions?
  for (var key in parentApi) {
    if ('function' === typeof parentApi[key])
      childApi[key] = parentApi[key];
  }
  return childApi;
};

/**
 * Clear API behavior.
 */

function clear(){
  // remove all listeners
  this.off();

  while (this.collection.length)
    this.remove(this.collection.pop());

  return this;
}

function remove(val, i){
  var emitter = this.collection[val] || val;
  emitter.off();
  delete this.collection[emitter.id];
  // XXX: delete from collection array.
}