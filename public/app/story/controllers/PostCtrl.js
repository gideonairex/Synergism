var synergism = angular.module( 'synergism.story.post-controller', [] );
synergism.controller( 'PostCtrl', [ '$scope', '$http', function ( $scope, $http ) {

	var self = this;
	this.data = {};
	this.comments = [];

	$http.get( '/v1/comments?postid=' + $scope.data.id )
				.success( function( data, status, headers, config ) {
					if( data.data ) {
						self.comments = data.data;
					}
				 })
				.error( function( data, status, headers, config ) {
					console.log( arguments );
				});

	this.submit = function () {
		var newComment = {};
		newComment.comment = $scope.comment.data.comment;
		newComment.postId  = $scope.data.id;

		$http.post( '/v1/comments', newComment )
					.success( function( data, status, headers, config ) {
						self.comments.push( data.data );
					 })
					.error( function( data, status, headers, config ) {
						console.log( arguments );
					});

	};

} ] );
