var Hapi  = require( 'hapi' );
var error = Hapi.error;

module.exports = function ( options ) {

	return [
		{
			path : '/v1/me',
			method : 'GET',
			handler : function( request, reply ) {
				var userModel = request.auth.credentials.userModel;
				userModel.find( {
					where : { id : userModel.dataValues.id }
				} ).then( function( me ) {
					delete me.dataValues.password;
					reply( {
						'class'      : [ 'user' ],
						'properties' : me.dataValues,
						'actions'    : [
							{
								'name'        : 'logout',
								'title'       : 'Logout user',
								'description' : 'Destroy session',
								'method'      : 'GET',
								'href'        : '/v1/logout'
							}
						]
					} );
				} );
			},
			config : {
				auth : 'api-auth'
			}
		}
	];

};
