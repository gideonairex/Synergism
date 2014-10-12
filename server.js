var Hapi      = require( 'hapi' );
var Sequelize = require( 'sequelize' );
var _         = require( 'lodash' );
var Path      = require( 'path' );

var config = {
	APP_PORT       : 9000,
	MODULEDIR      : './modules/',
	PUBLIC         : Path.join( __dirname, 'public' ),
	PSQL_DB        : 'synergism',
	PSQL_USER      : 'synergism',
	PSQL_PASSWORD  : 'synergism',
	PSQL_PORT      : 5432,
	SESSION_SECRET : 'synergismgideonairex'
};

var serverOptions = {
	views: {
		engines: {
			html: require( 'handlebars' )
		},
			path: config.PUBLIC
	}
};

var server = new Hapi.Server( config.APP_PORT, serverOptions );

var sequelize = new Sequelize(
			config.PSQL_DB,
			config.PSQL_USER,
			config.PSQL_PASSWORD, {
				dialect : 'postgres',
				port    : config.PSQL_PORT,
});

sequelize
	.authenticate()
	.complete( function( err ) {
		if ( err ) {
			console.log( 'Unable to connect to the database:', err );
		} else {
			console.log( 'Connection has been established successfully.' );
		}
} );

var models = require( config.MODULEDIR + 'db' )( sequelize );

//sequelize.sync(); add this if tables are not existing yet
//sequelize.sync( {force:true} );

var opt = {
	models : models
};

server.pack.register( [
	{
		plugin : require( config.MODULEDIR + 'auth' ),
		options : _.extend( {}, opt )
	},
	{
		plugin : require( config.MODULEDIR + 'users' ),
		options : _.extend( {}, opt )
	},
	{
		plugin : require( config.MODULEDIR + 'ontime' ),
		options : _.extend( {}, opt )
	},
	{
		plugin : require( config.MODULEDIR + 'gui' ),
		options : _.extend( {}, opt )
	},
	{
		plugin : require( config.MODULEDIR + 'api' ),
		options : _.extend( {}, opt )
	}
], function ( error ) {
	if( !error ) {
		server.start();
	}
} );
