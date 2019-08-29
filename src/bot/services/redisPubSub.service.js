const redisClient = require('../../config/redisConnection').getConnection(); // require & connect
const redisSub = require('../../config/redisConnection').getSubConnection();// different connection for pub
const { webHookChannel, port } = require('../../config/vars');
const axios = require('axios');
const chalk = require('chalk');

const defaultLocalCallBack = `http://localhost:${port}/v1/hook-callbacks/receive-data`;


exports.messageSubscribe = () => {
  redisSub.on('message', async (channel, message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const url = await redisClient.getAsync('webHookUrl');

      if (url) {
        const result = await axios.post(url, parsedMessage);
        console.log('response from hook url', result.data);
      } else {
        console.log(chalk.red.bold('you didn\'t setup hook url. read the doc'));
        console.log(chalk.yellow('we will use local url as callback of webhook'));
        const result = await axios.post(defaultLocalCallBack, parsedMessage);
        console.log('response from local hook url', result.data);
      }
    } catch (err) {
      console.log(err);
    }
  });

  redisSub.subscribe(webHookChannel);
};

exports.messagePublish = (message) => {
  redisClient.publish(webHookChannel, JSON.stringify(message));
};

exports.unSubscribeMessage = () => {
  redisSub.unsubscribe(webHookChannel);
};
