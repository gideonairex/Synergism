var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize ) {

	return {

		'Comment' : sequelize.define( 'Comment', _.extend ( {

			postId : {
				type : Sequelize.INTEGER
			},

			comment : {
				type : Sequelize.TEXT
			},

			userId : {
				type : Sequelize.INTEGER
			}

		}, Base ) )

	};

};
