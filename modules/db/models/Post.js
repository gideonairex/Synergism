var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize ) {

	return {

		'Post' : sequelize.define( 'post', _.extend( {

			storyId : {
				type : Sequelize.INTEGER
			},

			link : {
				type : Sequelize.STRING
			},


			content : {
				type : Sequelize.TEXT
			},

			title : {
				type : Sequelize.STRING
			},

			userId : {
				type : Sequelize.INTEGER,
				references : 'users',
				referencesKey : 'id'
			}

		}, Base ) )

	};
};
