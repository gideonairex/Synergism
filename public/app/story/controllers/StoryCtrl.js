angular.module( 'synergism.story.main-controller', [] )
	.controller( 'StoryCtrl', [ '$http', '$routeParams', function( $http, $routeParams ) {

	var self = this;
	this.posts = [];
	this.story = {};

	$http.get( '/v1/story/'+ $routeParams.id + '?x-synergism-app=xs' )
				.success( function ( resp ) {
					self.story = resp.data;
					$http.get( '/v1/posts?x-synergism-app=xs&story=' + self.story.id )
						.then( function ( data ) {
							// fix format
							self.posts = data.data.data;
							console.log( self.posts );
						} );
				} );

} ] );
