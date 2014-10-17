var hapi  = require( 'hapi' );
var _error = hapi.error;

module.exports = function ( options ) {

	var User    = options.models.User;
	var Comment = options.models.Comment;

	return [
		{
			path : '/v1/comments',
			method : 'POST',
			handler : function ( request, reply ) {
				var user = request.auth.credentials.userDetails;
				Comment.create( {
					postId  : request.payload.postId,
					comment : request.payload.comment,
					userId  : user.id
				} ).then ( function ( comment, created ) {
					comment.dataValues.commentor = user.firstname + ' ' + user.lastname;
					reply( { data : comment.dataValues } );
				} );
			},
			config : {
				auth : 'api-auth'
			}
		},
		{
			path : '/v1/comments',
			method : 'GET',
			handler : function ( request, reply ) {
				var query = {};
				if ( request.query.postid ) {
					query = { where : { postId : request.query.postid }, order : '"comment"."createdAt" ASC', include: [ User ] };
					Comment.findAll( query )
									.then( function( comments ) {
										var data = [];
										for( var i = 0; i < comments.length ; i++ ) {
											var user = comments[ i ].dataValues.user.dataValues;
											comments[ i ].dataValues.commentor = user.firstname + ' ' + user.lastname;
											data.push( comments[ i ].dataValues );
										}
										reply( { data : data } );
									} );
				} else {
					reply( _error.badRequest( 'dapat naay post id' ) );
				}
			},
			config : {
				auth : 'api-auth'
			}
		}
	];

};
