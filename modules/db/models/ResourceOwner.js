var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );
var crypto    = require( 'crypto' );

module.exports = function ( sequelize ) {

	var clientId = function () {
		var currentDate = ( new Date() ).valueOf().toString();
		var random      = Math.random().toString();
		return crypto.createHash( 'sha1' ).update( currentDate + random ).digest('hex');
	};

	var clientSecret = function () {
		var clientSecretHash = 'd1230j$^!)(()!asds';
		var currentDate      = ( new Date() ).valueOf().toString();
		var random           = Math.random().toString();
		return crypto.createHash( 'sha1' ).update( clientSecretHash + currentDate + random ).digest('hex');
	};

	return {

		'ResourceOwner' : sequelize.define( 'resource_owner', _.extend( {

			clientId : {
				type   : Sequelize.STRING,
				unique : true
			},

			clientSecret : {
				type : Sequelize.STRING
			},

			userId : {
				type          : Sequelize.INTEGER,
				references    : 'users',
				referencesKey : 'id'
			}

		}, Base ),
		{
			hooks : {
				beforeCreate : function ( resource ) {
					resource.dataValues.clientId     = clientId();
					resource.dataValues.clientSecret = clientSecret();
				}
			}
		} )

	};

};
