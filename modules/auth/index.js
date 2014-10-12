var Hapi   = require( 'hapi' );
var _      = require( 'lodash' );
var pkg    = require( './package.json' );
var _error = Hapi.error;

exports.register = function ( plugin, options, next ) {

	plugin.auth.scheme( 'api-scheme', strategies.apiStrategy );
	plugin.auth.strategy( 'api-auth', 'api-scheme', { authenticate : true, session : options.models.Session, user : options.models.User } );
	next();

};

var strategies = {};

strategies.apiStrategy = function ( server, options ) {

	var Session = options.session;
	var User    = options.user;

	return {

		authenticate : function ( request, reply ) {
			var _headers = request.headers;
			var _query   = request.query;

			var AppId = _headers[ 'x-synergism-app' ] || _query[ 'x-synergism-app' ];

			if ( !AppId ) {
				return reply( _error.unauthorized( 'Sorry dong' ) );
			}

			var sessionToken = request.state[ 'synergism-session' ];

			Session.find( {
				where : { sessionToken : sessionToken }
			} ).then( function ( session ) {
				if( session ) {
					if( session.dataValues.expiresAt > new Date() ) {
						User.find( { where : { id : session.dataValues.userId } } )
								.then ( function ( user ) {
									reply ( null, { credentials : _.extend( user.dataValues, session.dataValues ) } );
								} );
					} else {
						return reply( _error.forbidden( 'Wa na ang imong session' ) );
					}
				} else {
					return reply( _error.forbidden( 'Missing ka dont' ) );
				}
			} );

		}

	};

};

exports.register.attributes = {
	pkg : pkg
};
