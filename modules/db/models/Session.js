var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );
var crypto    = require( 'crypto' );

module.exports = function ( sequelize ) {

	// 1 hours
	var offset = 1;

	var hash = function () {
		var currentDate = ( new Date() ).valueOf().toString();
		var random      = Math.random().toString();
		return crypto.createHash( 'sha1' ).update(currentDate + random).digest('hex');
	};

	return {

		'Session' : sequelize.define( 'Session', _.extend( {

			sessionToken : {
				type   : Sequelize.STRING,
				unique : true,
				defaultValue : hash()
			},

			ontimeAccessToken : {
				type : Sequelize.STRING
			},

			userId : {
				type : Sequelize.INTEGER
			},

			expiresAt : {
				type : Sequelize.DATE
			}

		}, Base ),
		{
			hooks : {
				beforeCreate : function ( session ) {
					var d = new Date();
					d.setHours( d.getHours() + offset );
					session.dataValues.sessionToken = hash();
					session.dataValues.expiresAt = d;
				}
			}
		} )

	};

};
