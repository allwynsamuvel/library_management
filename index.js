//Third Party Modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const responseTime = require('response-time');
const dotenvFlow = require('dotenv-flow');
const cors = require('cors');

dotenvFlow.config();
console.log(' Current Environment ===>', process.env.NODE_ENV);

//Local Modules
const utils = require('./src/helpers/utils');
const {
  errorMessages
} = require('./src/helpers/errorMessage');
const config = require('./src/config/config');
const routes = require('./src/routes/routes');

require('./src/services/authServices');

require('./src/requireAllModels');

const app = express();

/* Security Middleware */
app.use(helmet());

/* Configuring port */
app.set('port', process.env.PORT || 8000);

app.disable('x-powered-by');

app.use(responseTime());

//Best practices app settings
app.set('title', 'PRDXN Node API');
app.set('query parser', 'extended');

const clientUrl = process.env.CLIENT_URL || config.client;

/* Importing database connection when server starts **/
require('./src/config/dbConfig');

/* CORS Setting */
const corsOption = {
  origin: clientUrl,
  optionsSuccessStatus: 200,
  methods: ['POST', 'GET', 'OPTIONS', 'HEAD', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: '*',
  preflightContinue: true,
};
app.use(cors(corsOption));
app.options('*', cors());

/* App activity logging */
app.use(morgan(':method :url :date :remote-addr :status :response-time'));

/* Parsing Request Limits */
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  'limit': '50mb',
  'extended': true
}));

/**
 * @name express-status-monitor
 * @description This middleware will report realtime server metrics for Express-based node servers.
 * Run server and go to /status
 * For further information: https://www.npmjs.com/package/express-status-monitor
 */
app.use(require('express-status-monitor')());

/**
 * @name compression
 * @description  This middleware will attempt to compress response bodies for all request that traverse through the middleware.
 */
app.use(compression());

/* Configuring Routes */
app.use('/api', routes);

/* Handling invalid route */
app.use('/', function (req, res) {
  res.status(404).send(utils.responseMsg(errorMessages.routeNotFound));
});

/**
 * Listening to port
 */
app.listen(app.get('port'), () => {
  console.log(`Find the server at port:${app.get('port')}`);
});

module.exports = app;
