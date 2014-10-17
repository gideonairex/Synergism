angular.module( 'synergism.user.ontime-auth-controller', [] )
	.controller( 'OntimeAuthCtrl', [ '$cookies', 'Authentication', '$location', function ( $cookies, Authentication, $location ) {

		Authentication.ontimeLogin( $cookies[ 'x-ontime-auth-code' ] )
			.then( function ( data ) {
				$location.path( '/story/1' );
			}, function ( error ) {
				console.log( error );
			} );

	} ] );
