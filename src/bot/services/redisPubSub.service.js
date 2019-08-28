const redisClient = require('../../config/redisConnection').getConnection(); // require & connect
const redisSub = require('../../config/redisConnection').getSubConnection();//different connection for pub
const {webHookChannel} = require('../../config/vars');
const axios = require('axios');
const chalk = require('chalk');


exports.messageSubscribe = () => {
    redisSub.on('message', async (channel, message) => {
        try {
            const parsedMessage = JSON.parse(message);
            const url = await redisClient.getAsync('webHookUrl');
            
            if(url) {
                const result = await axios.post(url, parsedMessage);
                console.log('response from hook url', result.data);
            }else {
                console.log(chalk.red.bold(`you didn't setup hook url. read the doc`));
            }
        }catch(err) {
            console.log(err);
        } 
    });

    redisSub.subscribe(webHookChannel);
};

exports.messagePublish = message => {
    redisClient.publish(webHookChannel, JSON.stringify(message));
};

exports.unSubscribeMessage = () => {
    redisSub.unsubscribe(webHookChannel);
};