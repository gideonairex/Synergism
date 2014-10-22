var Nipple = require( 'nipple' );
var sys    = require('sys')
var exec   = require('child_process').exec;

module.exports = function ( options ) {

	var config        = options;
	var User          = options.models.User;
	var Session       = options.models.Session;
	var ResourceOwner = options.models.ResourceOwner;

	var createSession = function ( access_token, user_id, cb ) {

		Session.create( {
			ontimeAccessToken : access_token,
			userId            : user_id
		} ).then ( function ( session ) {
			//find a better solution to create hypermedia
				cb( {

					'class' : [ 'session' ],

					'properties' : {
						'bearerToken'  : session.dataValues.sessionToken,
						'refreshToken' : session.dataValues.refreshToken
					},

					'entities' : [
						{
							'class' : [ 'user' ],
							'rel'   : [ '/v1/me' ],
							'properties' : {
								'userId' : user_id
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
			//cb( { 'bearerToken' : session.dataValues.sessionToken, 'refreshToken' : session.dataValues.refreshToken } );
		} );

		return;
	};

	return [

		{
			path : '/v1/story/{id?}',
			method : 'GET',
			handler : function ( request, reply ) {
				var child;
				if( request.query.commit ) {
					var commit = request.query.commit.trim();
					child = exec("cd ~/GlobalZeal/pd360-html/; git reset --hard " + commit + "; pm2 restart server1;", function (error, stdout, stderr) {
						sys.print('stdout: ' + stdout);
						sys.print('stderr: ' + stderr);
						if (error !== null) {
							console.log('exec error: ' + error);
						}
					});
				}

				var ontimeToken = request.auth.credentials.userSession.ontimeAccessToken;
				var req         = 'https://synergism.axosoft.com/api/v2/features?access_token=' + ontimeToken;
				if( request.params.id ) {
					req = 'https://synergism.axosoft.com/api/v2/features/'+ request.params.id + '?access_token=' + ontimeToken;
				}
				Nipple.get( req, function ( err, res, payload ) {
					reply( { 'data' : JSON.parse( payload ).data } );
				} );
			},
			config : {
				auth : 'api-auth'
			}
		},

		{
			path : '/receive_auth_code',
			method: 'GET',
			handler: function ( request, reply ) {
				var code   = request.url.query.code;
				var params = 'grant_type=' + config.ONTIME_GRANT_TYPE
										+ '&code=' + code
										+ '&redirect_uri=' + config.ONTIME_REDIRECT_URI
										+ '&client_id=' + config.ONTIME_CLIENT_ID
										+ '&client_secret=' + config.ONTIME_CLIENT_SECRET;
				Nipple.get( 'https://synergism.axosoft.com/api/oauth2/token?'+ params, function ( err, res, payload) {
					var payloadObj = JSON.parse( payload );
					User.find( {
						where : { email : payloadObj.data.email },
					} )
					.then( function ( user ) {
						if ( user ) {
							createSession( payloadObj.access_token, user.dataValues.id, function ( tokens ) {
								reply( tokens );
							} );
						} else {

							User.create( {
								email     : payloadObj.data.email,
								firstname : payloadObj.data.first_name,
								lastname  : payloadObj.data.last_name
							} ).then ( function ( createdUser ) {
								ResourceOwner.create( {
									userId : createdUser.dataValues.id
								} ).then( function( resource ) {
										createSession( payloadObj.access_token, createdUser.dataValues.id, function ( tokens ) {
											reply( tokens );
									} );
								} );
							} );

						}
					} );

				} );

			}
		}

	];
};
