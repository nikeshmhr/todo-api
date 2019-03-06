var mongoose = require("mongoose");

// make mongoose use global Promise
mongoose.Promise = global.Promise;

// Set the proper environment
var env = process.env.NODE_ENV || "development";

// Get the environment settings from config
var config = require("./config/mongo")[env];

console.log("config", config);

module.exports = () => {
	// Set the production MongoDB URL if
	// we're using the production config
	var envUrl = process.env[config.use_env_variable];

	// Define a local URL variable if we're
	// not in production
	var localUrl = `mongodb://${config.host}/${config.database}`;

	// Set the connection URL
	var mongoUrl = envUrl ? envUrl : localUrl;

	console.log("connecting with url", mongoUrl);
	// Connect!
	return mongoose.connect(mongoUrl, { useNewUrlParser: true });
};
