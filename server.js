'use strict';

const constants = require('./app/shared/constants'),
    express = require('express'),
    port = process.env.PORT || 9999,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

const app = express();

// make mongoose use global Promise
mongoose.Promise = global.Promise;
mongoose.connect(constants.DB_PROPS.getConnectionString(), {useNewUrlParser: true});

// We use bodyParser to make request data available in req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
**  START: Middleware
*/
var tasksRoute = require('./app/routes/tasks.route');
tasksRoute(app);
/*
** End: Middleware
*/

// Error handling if no endpoint found
app.use(function(req, res) {
    res.status(404).send({message: `API not found. '${req.originalUrl}'`});
});

app.listen(port);

console.log(`todo api running on port ${port}`);
