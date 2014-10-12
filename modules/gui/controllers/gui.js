module.exports = function ( options ) {

	return [

		{
			path   : '/login',
			method : 'GET',
			config : {
				auth : {
					strategy : 'api-auth',
					mode : 'try'
				},
				handler : function ( request, reply ) {
					if( request.auth.isAuthenticated ) {
						reply.redirect( '/' );
					} else {
						reply.view( 'login' );
					}
				}
			}
		},
		{
			path    : '/{params*}',
			method  : 'GET',
			handler : {
				directory : {
					path : 'public'
				}
			}
		}

	];
};
