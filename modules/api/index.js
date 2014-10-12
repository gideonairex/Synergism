var _   = require( 'lodash' );
var pkg = require( './package.json' );

exports.register = function ( plugin, options, next ) {
	var routes = _.union(
		require( './controllers/posts' )( options ),
		require( './controllers/comments' )( options )
	);
	plugin.route( routes );
	next();
};

exports.register.attributes = {
	pkg : pkg
};
