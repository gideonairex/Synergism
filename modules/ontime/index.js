var _ = require( 'lodash' );
var pkg = require( './package.json' );

exports.register = function ( plugin, options, next ) {
	var routes = _.union(
		require( './controllers/ontime' )( options )
	);
	plugin.route( routes );
	next();
};

exports.register.attributes = {
	pkg : pkg
};
