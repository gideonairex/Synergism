angular.module( 'synergism.story.issue-controller', [] )
	.controller( 'IssueCtrl', [ '$http', '$scope', function( $http, $scope ) {
			this.data = {};
			this.submit = function() {
				if ( $scope.story.id ) {
					$scope.issue.data.storyId = $scope.story.id;
					$http.post( '/v1/posts?x-synergism-app=xs', $scope.issue.data )
								.success( function( data, status, headers, config ) {
									console.log( arguments );
								 })
								.error( function( data, status, headers, config ) {
									console.log( arguments );
								});
				} else {
					alert ( 'No story' );
				}

			}
	} ] );
