"use strict";

const constants = require("./app/shared/constants"),
	express = require("express"),
	port = process.env.PORT || 9999,
	mongoose = require("./mongo"),
	bodyParser = require("body-parser"),
	cors = require("cors"),
    jwt = require('express-jwt'),
    jwtAuthz = require('express-jwt-authz'),
    jwksRsa = require('jwks-rsa');

const app = express();

// Connect to mongodb
mongoose()
	.then(function() {
		console.info("Database connection successful");
	})
	.catch(function(err) {
		console.error("Database connection error", err);
	});

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS enpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://nikeshmhr.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'http://mytodoapiv1.com',
    issuer: 'https://nikeshmhr.auth0.com/',
    algorithms: ['RS256']
});

// We use bodyParser to make request data available in req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow Cross Origin Resource Sharing
app.use(cors());

/*
 **  START: Middleware
 */
var tasksRoute = require("./app/routes/tasks.route");
tasksRoute(app, checkJwt);
/*
 ** End: Middleware
 */

// Error handling if no endpoint found
app.use(function(req, res) {
	res.status(404).send({ message: `API not found. '${req.originalUrl}'` });
});

app.listen(port);

console.log(`todo api running on port ${port}`);
