var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize ) {

	return {

		'Post' : sequelize.define( 'Post', _.extend( {

			storyId : {
				type : Sequelize.INTEGER
			},

			link : {
				type : Sequelize.STRING
			},

			userId : {
				type : Sequelize.INTEGER
			},

			content : {
				type : Sequelize.TEXT
			},

			title : {
				type : Sequelize.STRING
			}

		}, Base ) )

	};
};
