
exports.create = function(options){
  return new this(options);
}

exports.param = function(name, type, options, fn){
  if ('function' === typeof type) {
    fn = type;
    type = undefined;
    options = {};
  } else if ('function' === typeof options) {
    fn = options;
    options = {};
  }

  this.attrs || (this.attrs = {});
  options || (options = {})
  options.name = name;
  options.type = type || 'string';
  if (fn) options.to = fn;
  this.context = this.attrs[name] = options;
  return this;
}

var operator = require('tower-operator');

exports.validate = function(key, val){
  //var args = [].slice.call(arguments, 1);
  // XXX: validations, only for attr right now.
  var ok = operator(key);
  var operators = ['eq'];
  // tower/constraint-validator
  (this.context.validators || (this.context.validators = []))
    .push(function(ctx, constraint, fn){
      // contains(constraint.operator, operators)
      if (!ok(constraint.right.value, val)) {
        ctx.errors.push('Invalid ' + constraint.left.path);
      }
    });
  return this;
}

exports.self = function(){
  return this.context = this;
}