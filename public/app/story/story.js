angular.module( 'synergism.story', [
	'synergism.story.main-controller',
	'synergism.story.post-controller',
	'synergism.story.issue-controller'
] )
		.directive( 'issueForm', function() {
				return {
					restrict     : 'E',
					templateUrl  : 'app/story/directives/issue-form.html',
					controller   : 'IssueCtrl',
					controllerAs : 'issue',
					scope : {
						story : '='
					}
				};
		} )
		.directive( 'postContent', function() {
				return {
					restrict     : 'E',
					templateUrl  : 'app/story/directives/post-content.html',
					controller   : 'PostCtrl',
					controllerAs : 'post'
				};
		} );
