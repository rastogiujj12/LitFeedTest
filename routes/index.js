/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('../ks');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	services: importRoutes('../services'),
	// api: importRoutes('/api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.use('*', function (req, res, next) {
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
		res.header('Access-Control-Allow-Credentials', true);
		next();
	});
	app.options('*', function (req, res) {
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
		res.header('Access-Control-Allow-Credentials', true);
		res.sendStatus(200);
	});
	
	// sendRequest
	// checkOutgoingRequest,
	// checkIncominggRequest,
	// acceptIncomingRequest,
	// cancelIncomingRequest

	app.post("/login", routes.services.auth.login);

	app.post("/sendRequest", middleware.isLoggedIn, routes.services.user.sendRequest);
	app.get("/checkIncomingRequest", middleware.isLoggedIn, routes.services.user.checkIncomingRequest);
	app.get("/checkOutgoingRequest", middleware.isLoggedIn, routes.services.user.checkOutgoingRequest);

	app.post("/acceptIncomingRequest", middleware.isLoggedIn, routes.services.user.acceptIncomingRequest);
	app.post("/cancelIncomingRequest", middleware.isLoggedIn, routes.services.user.cancelIncomingRequest);


	app.get('*',            ((req, res)=>res.redirect(301, "/admin")) )


};
