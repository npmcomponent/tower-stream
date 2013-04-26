
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

exports.validate = function(key){
  var args = [].slice.call(arguments, 1);
  // XXX: validations
  //validations.push(function(ctx, param){
  //  
  //});
  return this;
}