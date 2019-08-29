const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs, port } = require('./vars');
const error = require('../api/middlewares/error');
const swaggerJSDoc = require('swagger-jsdoc');


/**
* Express instance
* @public
*/
const app = express();


// request logging. dev: console | production: file
app.use(morgan(logs));


// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
// view engine setup
// app.set('views', path.join(__dirname, '../public'));
/*
app.get('/fb', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'fb_login.html'));
}); */
app.get('/', (req, res, next) => {
  res.json({ status: 'Steve Chat Bot' });
});
// Swagger definition
const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Steve Chat Bot', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A NodeJs Chat Bot', // Description (optional)
  },
  host: `localhost:${port}`, // Host (optional)
  basePath: '/', // Base path (optional)
};


// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran,
  // not the application itself.
  apis: ['./src/api/routes/v1/*.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options('*', cors());


// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
