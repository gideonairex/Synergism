var Nipple = require( 'nipple' );

module.exports = function ( options ) {

	var User    = options.models.User;
	var Session = options.models.Session;

	var createSession = function ( access_token, user_id, reply ) {

		Session.create( {
			ontimeAccessToken : access_token,
			userId            : user_id
		} ).then ( function ( session ) {
			reply.state( 'synergism-session', session.dataValues.sessionToken );
			reply.redirect( '/' );
		} );

		return;
	};

	return [

		{
			path : '/v1/story/{id?}',
			method : 'GET',
			handler : function ( request, reply ) {
				var ontimeToken = request.auth.credentials.ontimeAccessToken;
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
				var params = 'grant_type=authorization_code&code=' + code + '&redirect_uri=http://localhost:9000/receive_auth_code&client_id=a488a031-39a2-48c8-a5c2-5368a4c27587&client_secret=a1a9ac5d-d8e4-4975-925d-19e419a1d636';

				Nipple.get( 'https://synergism.axosoft.com/api/oauth2/token?'+ params, function ( err, res, payload) {

					var payloadObj = JSON.parse( payload );

					User.find( {
						where : { email : payloadObj.data.email },
					} )
					.then( function ( user ) {
						if ( user ) {
							createSession( payloadObj.access_token, user.dataValues.id, reply );
						} else {
							User.create( {
								email     : payloadObj.data.email,
								firstname : payloadObj.data.first_name,
								lastname  : payloadObj.data.last_name
							} ).then ( function ( createdUser ) {
								createSession( payloadObj.access_token, createdUser.dataValues.id, reply );
							} );
						}
					} );

				} );

			}
		}

	];
};
