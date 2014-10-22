var fs        = require( 'fs' );
var Hapi      = require( 'hapi' );
var Sequelize = require( 'sequelize' );
var _         = require( 'lodash' );
var Path      = require( 'path' );
var redis     = require( 'redis' );

var config = {
	APP_PORT             : 9000,
	MODULEDIR            : './modules/',
	PUBLIC               : Path.join( __dirname, 'public' ),
	PSQL_DB              : 'synergism',
	PSQL_USER            : 'synergism',
	PSQL_PASSWORD        : 'synergism',
	PSQL_PORT            : 5432,
	ONTIME_CLIENT_ID     : 'a488a031-39a2-48c8-a5c2-5368a4c27587',
	ONTIME_CLIENT_SECRET : 'a1a9ac5d-d8e4-4975-925d-19e419a1d636',
	ONTIME_GRANT_TYPE    : 'authorization_code',
	ONTIME_REDIRECT_URI  : 'http://localhost:9099/auth.html',
	ENV                  : 'development'
};

var serverOptions = {
	// This should be enabled so that communication is encrypted
	// You should by a signed .pem
	// This is just self-signed cert
	/* This is to enable https
	tls : {
		key  : fs.readFileSync( './certificates/synergism-key.pem' ),
		cert : fs.readFileSync( './certificates/synergism-cert.pem' )
	},
	*/
	views: {
		engines: {
			html: require( 'handlebars' )
		},
			path: config.PUBLIC
	}

};

var server = new Hapi.Server( config.APP_PORT, serverOptions );

var redisClient = redis.createClient();
redisClient.on( 'connect', function() { } );

var sequelize = new Sequelize(
			config.PSQL_DB,
			config.PSQL_USER,
			config.PSQL_PASSWORD, {
				dialect : 'postgres',
				port    : config.PSQL_PORT,
				logging : false // change this depending on ENV
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

//sequelize.sync(); add this if tables are not existing yet
//sequelize.sync( {force:true} );

var utils  = require( config.MODULEDIR + 'utils' )( config, redisClient );
var models = require( config.MODULEDIR + 'db' )( sequelize, utils );

var opt = {
	utils  : utils,
	models : models
};

server.pack.register( [
	{
		plugin  : require( config.MODULEDIR + 'auth' ),
		options : _.extend( {}, opt )
	},
	{
		plugin  : require( config.MODULEDIR + 'users' ),
		options : _.extend( {}, opt )
	},
	{
		plugin  : require( config.MODULEDIR + 'ontime' ),
		options : _.extend( {}, opt, config )
	},
	{
		plugin  : require( config.MODULEDIR + 'gui' ),
		options : _.extend( {}, opt )
	},
	{
		plugin  : require( config.MODULEDIR + 'api' ),
		options : _.extend( {}, opt )
	}
], function ( error ) {
	if( !error ) {
		server.start();
	}
} );
