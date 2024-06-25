// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require app
var app = require('./ks');
var handlebars = require('express-handlebars');

app.init({
	'name': 'Litfeed',
	'brand': 'litfeed',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/img/logo.svg',
	'views': 'templates/views',
	'view engine': '.hbs',
	'frame guard': false,
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'admin path': 'admin',
	'signin logo': '/img/logo.svg'
});

// Load your project's Models
app.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
app.set('locals', {
	_: require('lodash'),
	env: app.get('env'),
	utils: app.utils,
	editable: app.content.editable,
});

// Load your project's Routes
app.set('routes', require('./routes'));


// Configure the navigation bar in app's Admin UI
// app.set('nav', {
// 	Users: ['users'],
// });

// Start app to connect to your database and initialise the web server
app.start();