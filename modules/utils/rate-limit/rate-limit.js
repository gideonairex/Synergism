var Hapi   = require( 'hapi' );
var _error = Hapi.error;

module.exports = function( config, redisClient ) {

	return {

		'rateLimit' : function ( options, request, cb ) {

			var ip = request.raw.req.connection.remoteAddress;
			redisClient.get( ip, function( err, val ) {

				if( typeof val === 'string' ) {
					val = parseInt( val );
				}
				if( val !== null && val > options.limit ) {
					var error = _error.badRequest( 'Too many requests try again later' );
					error.output.statusCode = 429;
					error.reformat();
					cb( error );
				} else {
					if( val === null || val === 0 ) {
						redisClient.multi( [
							[ 'setex', ip, options.time, 0 ]
						] ).exec( function ( err, val ) { } );
					}
					redisClient.incr( ip );
					cb( null );
				}

			} );

		}

	};

};
