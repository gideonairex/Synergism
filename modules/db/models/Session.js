var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );
var crypto    = require( 'crypto' );

module.exports = function ( sequelize, utils ) {

	// 1 hours
	var offset = 1;

	return {

		'Session' : sequelize.define( 'session', _.extend( {

			sessionToken : {
				type   : Sequelize.STRING,
				unique : true
			},

			refreshToken : {
				type   : Sequelize.STRING,
				unique : true
			},

			authorizationCode : {
				type   : Sequelize.STRING,
				unique : true
			},

			ontimeAccessToken : {
				type : Sequelize.STRING
			},

			userId : {
				type          : Sequelize.INTEGER,
				references    : 'users',
				referencesKey : 'id'
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

					session.dataValues.sessionToken      = utils.hash( { salt : 'sessionSalt' } );
					session.dataValues.refreshToken      = utils.hash( { salt : 'refreshSalt' } );
					session.dataValues.authorizationCode = utils.hash( { salt : 'authSalt' } );
					session.dataValues.expiresAt         = d;

				},
				beforeUpdate : function ( session ) {
					var d = new Date();
					d.setHours( d.getHours() + offset );

					session.dataValues.expiresAt = d;
				}
			}
		} )

	};

};
