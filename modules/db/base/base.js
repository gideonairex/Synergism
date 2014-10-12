var Sequelize = require( 'sequelize' );

module.exports = {
	deleted : {
		type : Sequelize.BOOLEAN,
		defaultValue : false
	},
	deletedAt : {
		type : Sequelize.DATE,
		defaultValue : Sequelize.NOW
	}
};
