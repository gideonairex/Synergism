var _ = require( 'lodash' );

module.exports = function ( sequalize, utils ) {

	var models = _.extend( {},
		require( './models/Comment' )( sequalize ),
		require( './models/Post' )( sequalize ),
		require( './models/ResourceOwner' )( sequalize ),
		require( './models/Session' )( sequalize, utils ),
		require( './models/User' )( sequalize, utils )
	);

	var Comment       = models.Comment;
	var Post          = models.Post;
	var ResourceOwner = models.ResourceOwner;
	var Session       = models.Session;
	var User          = models.User;

	User.hasMany( Comment, { onDelete: 'SET NULL', onUpdate : 'CASCADE' } );
	User.hasMany( Post, { onDelete: 'SET NULL', onUpdate : 'CASCADE' } );
	User.hasMany( ResourceOwner, { onDelete: 'SET NULL', onUpdate : 'CASCADE' } );
	User.hasMany( Session, { onDelete: 'SET NULL', onUpdate : 'CASCADE' } );

	Comment.belongsTo( User );
	Post.belongsTo( User );
	ResourceOwner.belongsTo( User );
	Session.belongsTo( User );

	Post.hasMany( Comment, { onDelete: 'SET NULL', onUpdate : 'CASCADE' } );
	Comment.belongsTo( Post );

	return models;

};
