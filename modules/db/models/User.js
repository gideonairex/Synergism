var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize ) {

	return {

		'User' : sequelize.define( 'User', _.extend( {

			email : {
				type   : Sequelize.STRING,
				unique : true
			},

			lastname  : Sequelize.STRING,

			firstname : Sequelize.STRING

		}, Base ) )

	};

};
