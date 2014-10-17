angular.module( 'synergism.user.login-controller', [] )
	.controller( 'LoginCtrl', [ 'Authentication', '$location', function ( Authentication, $location ) {

		var self = this;
		this.data = {};
		this.submit = function() {
			Authentication.login( self.data )
				.then( function( data ) {
					$location.path( '/story/1');
				}, function( data ) {
					if( data.statusCode === 440 ) {
						Authentication.refresh();
					} else {
						$location.path( '/login' );
					}
				} );
		};
	} ] );

