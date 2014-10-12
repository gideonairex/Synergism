var _ = require( 'lodash' );

module.exports = function ( sequalize ) {

	return _.extend( {},
		require( './models/User' )( sequalize ),
		require( './models/Session' )( sequalize ),
		require( './models/Post' )( sequalize ),
		require( './models/Comment' )( sequalize )
	);

};
