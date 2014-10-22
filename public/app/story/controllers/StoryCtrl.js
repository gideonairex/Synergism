angular.module( 'synergism.story.main-controller', [] )
	.controller( 'StoryCtrl', [ '$http', '$routeParams', 'Authentication', 'Session', '$location', function( $http, $routeParams, Authentication, Session, $location ) {

		var self = this;
		this.posts = [];
		this.story = {};

		var get = '/v1/story/' + $routeParams.id;
		if( $routeParams.commit ) {
			get += '?commit=' + $routeParams.commit;
		}
		$http.get( get )
					.success( function ( resp ) {
						self.story = resp.data;
						$http.get( '/v1/posts?story=' + self.story.id )
							.then( function ( data ) {
								// fix format
								if ( data.data.data ) {
									self.posts = data.data.data;
								}
							} );
					} );

		this.logout = function() {
			if( Authentication.isAuthenticated() ) {
				$http.get( '/v1/logout' )
					.success( function () {
						Session.destory();
						$location.path( '/login' );
					} )
					.error( function () {
						console.log( 'aym error');
					} );
			} else {
				$location.path( '/login' );
			}
		}

} ] );
