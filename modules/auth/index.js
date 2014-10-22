var Hapi   = require( 'hapi' );
var _      = require( 'lodash' );
var pkg    = require( './package.json' );
var _error = Hapi.error;

exports.register = function ( plugin, options, next ) {

	var routes = _.union(
		require( './oauth' )( options )
	);

	plugin.route( routes );
	plugin.auth.scheme( 'api-scheme', strategies.apiStrategy );
	plugin.auth.strategy( 'api-auth', 'api-scheme', { authenticate : true, session : options.models.Session, user : options.models.User, utils : options.utils } );

	next();

};

var strategies = {};

strategies.apiStrategy = function ( server, options ) {

	var Session = options.session;
	var User    = options.user;
	var utils   = options.utils;

	return {

		authenticate : function ( request, reply ) {

			utils.rateLimit( {
				limit : 25,
				time  : 60
			}, request, function ( err ) {

				if( err ) {
					return reply( err );
				}

				var _headers = request.headers;
				var _query   = request.query;
				var token    = _headers[ 'x-synergism-token' ] || _query[ 'x-synergism-token' ];
				Session.find( {
					where : { sessionToken : token, deleted : false }
				} ).then( function ( session ) {
					if( session ) {
						if( session.dataValues.expiresAt > new Date() ) {
							User.find( { where : { id : session.dataValues.userId } } )
									.then ( function ( user ) {
										reply ( null, { credentials : _.extend( { userDetails : user.dataValues }, { userSession : session.dataValues }, { userModel : user }, { sessionModel : session } ) } );
									} );
						} else {
							var error = _error.badRequest( 'Session expired' );
									error.output.statusCode = 440;    // Session expired status
									error.reformat();
							return reply( error );
						}
					} else {
						return reply( _error.forbidden( 'Missing ka dong' ) );
					}
				} );

			} );

		}

	};

};

exports.register.attributes = {
	pkg : pkg
};
