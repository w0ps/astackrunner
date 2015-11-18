function createStack( parallelism ) {
	parallelism = parallelism || 1;
	
	var stack = [],
			emptySubscribers = [],
			api = {
				add: function( substack ) {
					// adding is a lot less common than items being executed, so optimized for popping
					Array.prototype.unshift.apply( stack, substack.slice().reverse() );
					notifying = false;
					start();

					return api;
				},
				execute: function( fun ){
					processor = fun;
					start();

					return api;
				},
				onEmpty: function( fun ) {
					emptySubscribers.push( fun );

					return api;
				},
			},
			processor,
			running,
			notifying;

	Object.defineProperty( api, 'length', { get: function(){ return stack.length; } } );

	return api;

	function start() {
		if( running || !processor || !stack.length ) return;
		var p = 0;
		running = true;
		while( p++ < parallelism && stack.length ) {
			setImmediate( call );
		}
	}

	function call( err ) {
		if( err ) {
			running = false;
			return notifyEmpty( err );
		}

		if( !running ) return;

		if( !stack.length ) {
			running = false;
			p = 0;
			notifyEmpty();
			return;
		}
		
		return processor( stack.pop(), setImmediate.bind( null, call ) );
	}

	function notifyEmpty( err ) {
		if( notifying ) return;
		notifying = true;

		emptySubscribers.forEach( function( subscriber ) {
			subscriber( err );
		} );
	}

}

module.exports.create = createStack;
