angular.module( 'synergism.story.issue-controller', [] )
	.controller( 'IssueCtrl', [ '$http', '$scope', function( $http, $scope ) {
			this.data = {};
			this.submit = function() {
				if ( $scope.story.id ) {
					$scope.issue.data.storyId = $scope.story.id;
					$http.post( '/v1/posts', $scope.issue.data )
								.success( function( data, status, headers, config ) {
									$scope.$parent.main.posts.unshift( data.data );
								 })
								.error( function( data, status, headers, config ) {
									console.log( arguments );
								});
				} else {
					alert ( 'No story' );
				}
} } ] );
