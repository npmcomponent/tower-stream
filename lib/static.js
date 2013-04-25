
exports.create = function(options){
  return new this(options);
}

var context;

exports.attr = function(name, type, options){
  this.attrs || (this.attrs = {});
  options || (options = {})
  options.name = name;
  options.type = type || 'string';
  context = this.attrs[name] = options;
  return this;
}

exports.param = exports.attr;

exports.alias = function(name){
  context.alias = name;
  return this;
}