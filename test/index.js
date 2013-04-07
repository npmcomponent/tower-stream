var stream = 'undefined' == typeof window
  ? require('..')
  : require('tower-stream'); // how to do this better?

var assert = require('assert');

describe('stream', function(){
  beforeEach(stream.clear);

  it('should define', function(done){
    stream.on('define', function(s){
      assert('word-counter' === s.id);

      done();
    });

    stream('word-counter');
  });

  it('should fire events', function(done){
    var calls = [];

    stream('word-counter')
      .on('init', function(s){
        calls.push('init');
      })
      .on('execute', function(s, fn){
        calls.push('execute');
      })
      .on('close', function(s, fn){
        calls.push('close');

        assert('init' === calls[0]);
        assert('execute' === calls[1]);
        assert('close' === calls[2]);

        done();
      });

    var counter = stream('word-counter').create();
    assert(1 === calls.length);

    counter.execute();
    assert(2 === calls.length);

    counter.close();
  });
});
