var Sequelize = require( 'sequelize' );
var Base      = require( '../base/base' );
var _         = require( 'lodash' );

module.exports = function ( sequelize ) {

	return {

		'Comment' : sequelize.define( 'comment', _.extend ( {

			postId : {
				type : Sequelize.INTEGER,
				references : 'posts',
				referencesKey : 'id'
			},

			userId : {
				type : Sequelize.INTEGER,
				references : 'users',
				referencesKey : 'id'
			},

			comment : {
				type : Sequelize.TEXT
			}

		}, Base ) )

	};

};
