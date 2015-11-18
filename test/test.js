var assert = require('assert'),
    aStackRunner = require('../index'),
    testRunner;

describe('aStackRunner', function() {
  describe('executes item on the stack with the processor and notifies when done', function () {
    var testArray = [1, 2, 3],
        testArray2 = [4, 5, NaN],
        processorCalledTimes = 0,
        emptyHandlerCalledTimes = 0,
        callDone;

    function processor( item, cb ){
      processorCalledTimes++;
      if( isNaN( item) ) return cb( 'NaN found' );
      cb();
    }

    function emptyHandler( err ){
      emptyHandlerCalledTimes++;
      callDone && callDone( err );
    }

    it('creates instance with .create', function () {
      testRunner = aStackRunner.create();
    });

    it('allows processor to be set', function(){
      testRunner.execute( processor );
    });

    it('allows subscribing to onEmpty', function(){
      testRunner.onEmpty( emptyHandler );
    });

    it('starts automatically when items are added', function( done ) {
      callDone = function( err ) {
        assert.equal( processorCalledTimes, testArray.length );
        assert.equal( emptyHandlerCalledTimes, 1 );
        done();
      };
      testRunner.add( testArray );
    });

    it('continues when new items are added', function(done){
      callDone = function( err ) {
        assert.equal( processorCalledTimes, testArray.length + testArray2.length );
        assert.equal( emptyHandlerCalledTimes, 2 );
        assert( err, 'NaN found');
        done();
      };

      testRunner.add( testArray2 );
    });
  });
});
