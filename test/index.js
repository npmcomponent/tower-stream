var stream = 'undefined' == typeof window
  ? require('..')
  : require('tower-stream'); // how to do this better?

var assert = require('assert');

describe('stream', function(){
  it('should test', function(){
    assert.equal(1 + 1, 2);
  });
});
