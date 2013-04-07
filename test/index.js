var stream = 'undefined' == typeof window
  ? require('..')
  : require('tower-stream'); // how to do this better?

var assert = require('assert');

describe('stream', function(){
  it('should define', function(done){
    stream.on('define', function(s){
      assert('word-count' === s.id);

      done();
    });

    stream('word-count');
  });
});
