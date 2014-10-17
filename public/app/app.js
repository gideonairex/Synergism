'use strict';

angular.module( 'synergism', [
									'ngCookies',
									'ngRoute',
									'synergism.story',
									'synergism.user',
									'mgcrea.ngStrap'
								] )
	.factory( 'Session', [ '$cookieStore', '$cookies', function ( $cookieStore, $cookies ) {

		this.create = function( session ) {
			$cookies[ 'x-synergism-bearer-token' ]  = session.properties.bearerToken;
			$cookies[ 'x-synergism-refresh-token' ] = session.properties.refreshToken;
			$cookieStore.remove( 'x-ontime-auth-code');
		};

		this.getBearer = function () {
			return $cookies[ 'x-synergism-bearer-token' ];
		};

		this.getRefresh = function () {
			return $cookies[ 'x-synergism-refresh-token' ];
		};

		this.destory = function() {
			$cookieStore.remove( 'x-synergism-bearer-token' );
			$cookieStore.remove( 'x-synergism-refresh-token' );
			console.log( 'awd' );
		};

		return this;

	} ] )
	.factory( 'Authentication', [ '$http', '$q', 'Session', function ( $http, $q, Session ) {
		var authentication = {};

		authentication.login = function( logginUser ) {

			var deferred = $q.defer();

			$http.post( '/v1/login', logginUser )
					.success( function ( data, status, headers, config ) {
						Session.create( data );
						deferred.resolve( data );
					} )
					.error( function( data, status, headers, config ) {
						deferred.reject( data );
					} );

			return deferred.promise;
		};

		authentication.ontimeLogin = function ( auth_code ) {
			var deferred = $q.defer();
			$http.get( '/receive_auth_code', { params : { 'code' : auth_code } } )
				.success( function ( data, status, headers, config ) {
					Session.create( data );
					deferred.resolve( data );
				} )
				.error( function ( data, status, headers, config ) {
					deferred.reject( 'oops' );
				} );
			return deferred.promise;
		};

		// Should find a way to when to refresh
		authentication.refresh = function () {
			var deferred = $q.defer();
			$http.get( '/oauth/refresh_token', { params : { 'x-synergism-refresh-token' : Session.getRefresh() } } )
				.success( function ( data, status, headers, config ) {
					deferred.resolve( data );
				} )
				.error( function ( data, status, headers, config ) {
					deferred.reject( 'wa na' );
				} );
			return deferred.promise;
		};

		authentication.isAuthenticated = function() {
			if( Session.getBearer() ) {
				return 1;
			}
			return 0;
		};

		return authentication;

	} ] )
	.factory( 'authenticationInterceptor', [ 'Session', function ( Session ) {

		var requestInterceptor = {
			'request' : function ( config ) {
				if( Session.getBearer() ) {
					config.headers[ 'x-synergism-token' ] = Session.getBearer();
				}
				return config;
			}
		};

		return requestInterceptor;

	} ] )
	.config( [ '$routeProvider', '$httpProvider', function ( $routeProvider, $httpProvider ) {

		$httpProvider.interceptors.push( 'authenticationInterceptor' );

		var auth = {
								auth : [ '$location', 'Authentication', function( $location, Authentication ) {
									if ( !Authentication.isAuthenticated() ) {
										$location.path( '/login' );
									}
								} ]
		};

		var logRestrict = {
								auth : [ '$location', 'Authentication', function( $location, Authentication ) {
									if ( Authentication.isAuthenticated() ) {
										$location.path( '/story/1' );
									}
								} ]
		};

		$routeProvider
			.when( '/story/:id', {
				templateUrl  : 'app/story/views/index.html',
				controller   : 'StoryCtrl',
				controllerAs : 'main',
				resolve      : auth
			} )
			.when( '/login', {
				templateUrl  : 'app/user/views/login.html',
				controller   : 'LoginCtrl',
				controllerAs : 'login',
				resolve      : logRestrict
			} )
			.when( '/retrieve_ontime_auth_code', {
				templateUrl  : 'app/user/views/ontime-auth.html',
				controller   : 'OntimeAuthCtrl',
				controllerAs : 'ontimeAuth'
			} );

	} ] )
	.run( [ '$rootScope', function ( $rootScope ) {
		/*
		$rootScope.$on("$locationChangeStart", function( event, next, current ) {
			//console.log( arguments );
		} );
		*/

	} ] );
