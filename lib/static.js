
/**
 * Module dependencies.
 */

var Param = require('tower-param').Param;
var Attr = require('tower-attr').Attr;

/**
 * Instantiate a new `Stream`.
 *
 * XXX: rename to `init`.
 *
 * @param {Object} options Stream options.
 * @return {Stream} A `Stream` instance.
 * @api public
 */

exports.create = function(options){
  return new this(options);
};
exports.init = exports.create;

/**
 * Instantiate a new `Param`.
 *
 * @param {String} name Param name.
 * @param {String} type Param type.
 * @param {Object} options Param options.
 * @return {Param} A `Param` instance.
 * @api public.
 */

exports.param = function(name, type, options){
  this.params || (this.params = []);
  this.context = this.params[name] = new Param(name, type, options);
  this.params.push(this.context);
  return this;
};

/**
 * Instantiate a new `Attr`.
 *
 * @param {String} name Attr name.
 * @param {Type} type Attr type.
 * @param {Object} options Attr options.
 * @return {Attr} A `Attr` instance.
 * @api public.
 */

exports.attr = function(name, type, options){
  this.attrs || (this.attrs = []);
  this.context = this.attrs[name] = new Attr(name, type, options);
  this.attrs.push(this.context);
  return this;
};

/**
 * Add an alias.
 *
 * @param {String} name An alias name.
 * @return {Object} The instance object.
 */

exports.alias = function(name){
  this.context.alias(name);
  return this;
};

/**
 * Define a validator.
 *
 * @param {String} key Name of the operator for assertion.
 * @param {Mixed} val
 * @return {Object} The instance object.
 */

exports.validate = function(key, val){
  if (this === this.context)
    // key is a function
    this.validator(key, val)
  else
    // param or attr
    this.context.validator(key, val);

  return this;
};

/**
 * Append a validator function to the stack.
 *
 * @param {Function} fn A validator function.
 * @return {Object} The instance object.
 */

exports.validator = function(fn){
  // XXX: just a function in this case, but could handle more.
  this.validators.push(fn);
  return this;
};

/**
 * Reset the `context` to `this`.
 *
 * @return {Object} The instance object.
 */

exports.self = function(){
  return this.context = this;
};