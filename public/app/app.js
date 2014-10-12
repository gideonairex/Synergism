'use strict';

angular.module( 'syngersim.story', [] );

var synergism = angular.module( 'synergism', [
									'ngRoute',
									'synergism.story'
								] );

synergism.config( [ '$routeProvider', function ( $routeProvider ) {

	$routeProvider.when( '/story/:id', {
		templateUrl : 'app/story/views/index.html',
		controller  : 'StoryCtrl',
		controllerAs : 'main'
	} );

} ] );
