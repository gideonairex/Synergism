var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize, utils ) {

	return {

		'User' : sequelize.define( 'user', _.extend( {

			email : {
				type   : Sequelize.STRING,
				unique : true
			},

			username : {
				type : Sequelize.STRING,
				unique : true
			},

			password : {
				type : Sequelize.STRING
			},

			lastname  : Sequelize.STRING,

			firstname : Sequelize.STRING

		}, Base ),
		{
			hooks : {
				beforeUpdate : function ( user ) {
					user.dataValues.password = utils.userHash( { value : user.dataValues.password, salt : 'passwordSalt' } );
				}
			}
		} )

	};

};
