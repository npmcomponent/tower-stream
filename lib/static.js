
/**
 * Module dependencies.
 */

var Param = require('tower-param');

/**
 * Instantiate a new `Stream`.
 *
 * XXX: rename to `init`.
 *
 * @param {Object} options
 * @api public
 */

exports.create = function(options){
  return new this(options);
}

/**
 * Instantiate a new `Param`.
 *
 * @api public.
 */

exports.param = function(name, type, options){
  this.params || (this.params = {});
  this.context = this.params[name] = new Param(name, type, options);
  return this;
}

/**
 * Define a validator.
 *
 * @param {String} key Name of the operator for assertion.
 * @param {Mixed} val
 * @return {this}
 */

exports.validate = function(key, val){
  if (this === this.context)
    // key is a function
    this.validator(key, val)
  else
    // param or attr
    this.context.validator(key, val);

  return this;
}

/**
 * Append a validator function to the stack.
 *
 * @param {Function} fn
 * @return {this}
 */

exports.validator = function(fn){
  // XXX: just a function in this case, but could handle more.
  this.validators.push(fn);
  return this;
}

/**
 * Reset the `context` to `this`.
 *
 * @return {this}
 */

exports.self = function(){
  return this.context = this;
}