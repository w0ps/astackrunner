[![Build Status](https://travis-ci.org/w0ps/astackrunner.svg)](https://travis-ci.org/w0ps/astackrunner)

# astackrunner
"like async.forEach but you can add more items to it while it's underway or finished

usage:
`var aStackRunner = require('astackrunner'),
    parallelism = 2,
    myStackRunner = aStackRunner.create( parallelism )
      .onEmpty( console.log.bind(console, 'done!') )
      .execute( function( val, cb ){ var err; console.log(val); cb( err ); } )
      .add( [1,2,3] );`
