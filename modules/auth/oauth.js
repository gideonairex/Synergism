// Simple OAuth 2.0 without scope
var _error = require( 'Hapi' ).error;

module.exports = function ( option ) {

	var Session       = option.models.Session;
	var ResourceOwner = option.models.ResourceOwner;

	return [
		{
			path    : '/oauth/refresh_token',
			method  : 'GET',
			handler : function ( request, reply ) {
				var _headers     = request.headers;
				var _query       = request.query;
				var refreshToken = _headers[ 'x-synergism-refresh-token' ] || _query[ 'x-synergism-refresh-token' ];
				Session.find ( {
					where : { refreshToken : refreshToken, deleted : false }
				} ).then( function ( session ) {
					if ( session ) {
						session.save()
										.then( function ( newSession ) {
											reply( newSession.dataValues );
										} );
					} else {
						reply( _error.unauthorized( 'wa na imong session dong' ) );
					}
				} );
			}
		},
		{
			path : '/oauth/authorize',
			method : 'GET',
			handler : function ( request, reply ) {
				var _query       = request.query;
				var clientId     = _query[ 'client_id' ];
				var clientSecret = _query[ 'client_secret' ];
				var redirectUri  = _query[ 'redirect_uri' ];
				// dont include this first
				// var scope        = _query[ 'scope' ];
				// var state        = _query[ 'state' ];
				ResourceOwner.find( {
					where : {
						clientId     : clientId,
						clientSecret : clientSecret
					}
				} ).then( function ( resourceOwner ) {
					if ( resourceOwner ) {
						Session.find( {
							where : { userId : resourceOwner.dataValues.userId, deleted : false }
						} ).then( function( session ) {
							// This is created with ontime
							// Account should have a ontime account first to login
							// If none then log through on time first
							if( session ) {
								Session.create( {
									userId            : resourceOwner.userId,
									ontimeAccessToken : session.dataValues.ontimeAccessToken
								} ).then( function ( newSession ) {
									if( redirectUri ) {
										reply.redirect( redirectUri + '?auth_code=' + newSession.dataValues.authorizationCode );
									} else {
										reply( { 'authorization_code' : newSession.dataValues.authorizationCode } );
									}
								} );
							} else {
								reply( _error.unauthorized( 'wa pa kay ontime account pa log to ontime sa' ) );
							}

						} );
					} else {
						reply( _error.unauthorized( 'jok jok ka way pa ka register' ) );
					}
				} );
			}
		},
		{
			path : '/oauth/access_token',
			method : 'POST',
			handler : function ( request, reply ) {
				var _payload          = request.payload;
				var authorizationCode = _payload[ 'auth_code' ];
				var clientId          = _payload[ 'client_id' ];
				var clientSecret      = _payload[ 'client_secret' ];
				var redirectUri       = _payload[ 'redirect_uri' ];

				ResourceOwner.find( {
					where : {
						clientId     : clientId,
						clientSecret : clientSecret
					}
				} ).then( function ( resourceOwner ) {
					if ( resourceOwner ) {
						Session.find( {
							where : { authorizationCode : authorizationCode, deleted : false }
						} ).then( function ( session ) {
							if ( session ) {
								if( redirectUri ) {
									reply.redirect( redirectUri + '?' + 'bearerToken=' + session.dataValues.sessionToken + '&refreshToken=' + session.dataValues.refreshToken );
								} else {
									reply( { 'bearerToken' : session.dataValues.sessionToken, 'refreshToken' : session.dataValues.refreshToken } );
								}
							} else {
								reply( _error.unauthorized( 'you are not existing' ) );
							}
						} );
					} else {
						reply( _error.unauthorized( 'jok jok ka way pa ka register' ) );
					}
				} );

			}
		}
	];

};
