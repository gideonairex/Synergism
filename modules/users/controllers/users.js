var Hapi  = require( 'hapi' );
var error = Hapi.error;

module.exports = function ( options ) {
	var User = options.models.User;

	return [
		{
			path : '/v1/users/{username?}',
			method : 'GET',
			handler : function ( request, reply ) {

				if ( request.params.username ) {
					User.find( { where : { username : request.params.username } } )
							.success( function ( user ) {
								console.log( user );
							} );
				} else {
					User.findAll( {} )
							.success( function ( users ) {

								console.log( users );
					} );
				}

				reply( { 'info' : 'get all users' } );
			}
		},{
			path : '/v1/users',
			method : 'POST',
			handler : function ( request, reply ) {

				User.findOrCreate( {
					where : { username : request.payload.username }
				}, { password : request.payload.password } )
						.success( function ( user, created ) {
							console.log( user );
							console.log( created );
							reply( { 'data' : 'asd' } );
						} );
			}
		}
	];

};
