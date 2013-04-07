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
      .on('init', function(node){
        calls.push('init');

        assert('word-counter' === node.name);
      })
      .on('execute', function(node, data, fn){
        calls.push('execute');

        assert('hello' === data.word);
      })
      .on('close', function(node, fn){
        calls.push('close');

        assert('init' === calls[0]);
        assert('execute' === calls[1]);
        assert('close' === calls[2]);

        done();
      });

    var counter = stream('word-counter').create();
    assert(1 === calls.length);

    counter.execute({ word: 'hello' });
    assert(2 === calls.length);

    counter.close();
  });

  it('should count words', function(done){
    stream('word-counter')
      .on('init', function(node){
        node.words = {};
      })
      .on('execute', function(node, data){
        node.words[data.word] == null
          ? (node.words[data.word] = 1)
          : (++node.words[data.word]);
      })
      .on('close', function(node, fn){
        assert(5 === node.words['hello'])
        assert(2 === node.words['world']);

        done();
      });

    var counter = stream('word-counter').create();
    counter.execute({ word: 'hello' });
    counter.execute({ word: 'hello' });
    counter.execute({ word: 'hello' });
    counter.execute({ word: 'hello' });
    counter.execute({ word: 'hello' });
    counter.execute({ word: 'world' });
    counter.execute({ word: 'world' });
    counter.close();
  });
});
