var _   = require( 'lodash' );

module.exports = function ( config ) {
	var utils = _.extend( {},
		require( './encrypts/encrypts' )( config )
	);
	return utils;
};
