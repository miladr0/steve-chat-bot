const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
    mongoStringURI: process.env.MONGO_URI_CONNECTION_STRING_FORMAT,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },
  webHookChannel: process.env.WEB_HOOK_CHANNEL,
};
