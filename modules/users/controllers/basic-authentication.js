var Hapi      = require( 'hapi' );
var Sequelize = require( 'sequelize' );
var _error    = Hapi.error;

module.exports = function ( options ) {

	var User    = options.models.User;
	var Session = options.models.Session;
	var utils   = options.utils;

	return [
		{
			path    : '/v1/login',
			method  : 'POST',
			handler : function ( request, reply ) {

				// If use is already log in dont process
				// console.log( request.auth );

				var _payload = request.payload;
				var username = _payload[ 'username' ] || '';
				var password = _payload[ 'password' ];

				var encryptPassword = utils.userHash( { value : password, salt : 'passwordSalt' } );

				// Add checking if he is regitered add field
				User.find( {
					where : Sequelize.or( { username : username }, { email : username } )
				} ).then( function( user ) {
					if( user ) {
						if( user.dataValues.password === encryptPassword ) {
							Session.find( {
								where : { userId : user.dataValues.id }
							} ).then( function ( session ) {
								// This just gets the previous access token from ontime
								Session.create( {
									userId            : user.dataValues.id,
									ontimeAccessToken : session.dataValues.ontimeAccessToken
								} ).then( function ( newSession ) {
									reply( {

										'class' : [ 'session' ],

										'properties' : {
											'bearerToken'  : newSession.dataValues.sessionToken,
											'refreshToken' : newSession.dataValues.refreshToken
										},

										'entities' : [
											{
												'class' : [ 'user' ],
												'rel'   : [ '/v1/me' ],
												'properties' : {
													'userId' : user.dataValues.id
												},
												'href'  : '/v1/me'
											}
										],

										'actions' : [
											{
												'name'        : 'refresh-token',
												'title'       : 'Refresh Token',
												'description' : 'This is to refresh the bearerToken',
												'method'      : 'GET',
												'href'        : '/oauth/refresh_token',
												'alternative' : 'Instead of query string, add fields on headers',
												'fields' : [
													{
														'name' : 'x-synergism-refresh-token',
														'type' : 'text'
													}
												]
											}
										]

									} );
								} );
							} );
						} else {
							reply( _error.unauthorized( 'mali imong password dodong' ) );
						}
					} else {
							reply( _error.unauthorized( 'wa ka ka exist' ) );
					}
				} );

			},
			config : {
				auth : {
					strategy : 'api-auth',
					mode     : 'try'
				}
			}
		},
		{
			path    : '/v1/register',
			method  : 'POST',
			handler : function ( request, reply ) {

				var loggedUser = request.auth.credentials;
				var userModel  = loggedUser.userModel;
				var _payload   = request.payload;

				userModel.username = _payload[ 'username' ];
				userModel.password = _payload[ 'password' ];

				userModel.save()
									.then( function ( updatedUser ) {
										delete updatedUser.dataValues.password;
										reply( updatedUser.dataValues);
									} );

			},
			config : {
				auth : 'api-auth'
			}
		},
		{
			path    : '/v1/logout',
			method  : 'GET',
			handler : function ( request, reply ) {

				var sessionModel = request.auth.credentials.sessionModel;
				sessionModel.destroy()
										.then( function ( deletedSession ) {
											reply( { 'message' : 'logout successfull' } );
										} );
			},
			config : {
				auth : 'api-auth'
			}
		}
	];

};
