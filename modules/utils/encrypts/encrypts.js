var _      = require( 'lodash' );
var crypto = require( 'crypto' );

module.exports = function ( config ) {

	var salts = {
		passwordSalt : '!D9812nbjas1212',
		refreshSalt  : '$adnjknjn123189hnxcakw',
		sessionSalt  : 'kjjn130-89nk9012u3n90123',
		authSalt     : '$ad678123no0o12jk3n,mnasdnjknjn123189hnxcakw'
	};

	return {
		'hash' : function ( options ) {
					var currentDate = ( new Date() ).valueOf().toString();
					var random      = Math.random().toString();
					return crypto
									.createHash( 'sha1' )
									.update( currentDate + random + salts[ options.salt ] )
									.digest( 'hex' );
		},
		'userHash' : function ( options ) {
					return crypto
									.createHash( 'sha1' )
									.update( salts[ options.salt ] + options.value )
									.digest( 'hex' );
		}
	};

};
