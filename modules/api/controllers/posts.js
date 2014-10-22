var hapi  = require( 'hapi' );
var error = hapi.error;

module.exports = function ( options ) {
	var Post = options.models.Post;
	var regexURL = new RegExp ( /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ );
	return [
		{
			path : '/v1/posts/{postid?}',
			method : 'GET',
			handler : function( request, reply ) {
				//console.log( request.raw.req.connection.remoteAddress ) ;
				var query = {};

				if ( request.params.postid ) {
					query = { id : request.params.postid };

					if ( request.query.story ) {
						query.storyId = request.query.story;
					}

					Post.find( { where : query , order : ' "createdAt" DESC' } )
							.then( function ( post ) {
								if( post ) {
									if ( post.dataValues.link.match ( regexURL ) ) {
										post.dataValues.type = 'movie';
									} else {
										post.dataValues.type = 'picture';
									}
									reply( { 'data' : post.dataValues } );
								}
							} );

				} else {

					if ( request.query.story ) {
						query = { where: { storyId : request.query.story }, order: ' "createdAt" DESC' };
					}

					Post.findAll( query )
							.then( function ( posts ) {
								if( posts.length > 0 ) {
									var data = [];
									for( var i = 0; i < posts.length; i++ ) {
										if ( posts[ i ].dataValues.link.match ( regexURL ) ) {
											posts[ i ].setDataValue( 'type', 'movie' );
										} else {
											posts[ i ].setDataValue( 'type', 'picture' );
										}
										data.push( posts[ i ].dataValues );
									}
									reply( { 'data' : data } );
								} else {
									reply( { 'basta': 'mag add pa ko error' } );
								}
							} );
				}
			},
			config : {
				auth : 'api-auth'
			}
		},
		{
			path : '/v1/posts',
			method : 'POST',
			handler : function ( request, reply ) {
				var user = request.auth.credentials;

				Post.create( {
					storyId : request.payload.storyId,
					link    : request.payload.link,
					userId  : user.userId,
					content : request.payload.content,
					title   : request.payload.title
				} ).then( function ( post, created ) {
					if ( post.dataValues.link.match ( regexURL ) ) {
						post.dataValues.type = 'movie';
					} else {
						post.dataValues.type = 'picture';
					}
					reply( { data : post.dataValues } );
				} );
			},
			config : {
				auth : 'api-auth'
			}
		}
	];

};
