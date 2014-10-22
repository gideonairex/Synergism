var _   = require( 'lodash' );

module.exports = function ( config, redisClient ) {
	var utils = _.extend( {},
		require( './encrypts/encrypts' )( config ),
		require( './rate-limit/rate-limit' )( config, redisClient )
	);
	return utils;
};
