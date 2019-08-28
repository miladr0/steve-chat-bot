const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const logger = require('../../config/logger');
const Message = require('../models/message.model');
const redisClient = require('../../config/redisConnection').getConnection(); // require & connect


/**
 * Get Message
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const {messageId} = req.params;
    const message = await Message.get(messageId);

    res.json(message);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get message list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const messages = await Message.list(req.query);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Message
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const {messageId} = req.params;
    const deleteResult = await Message.deleteOne({ _id: messageId });
    if (deleteResult.n === 0) throw new APIError({ message: 'Message not found', status: httpStatus.NOT_FOUND });

    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};


/**
 * set a url for web hook
 * @public
 */
exports.setWebHookUrl = async (req, res, next) => {
  try {
    const {url} = req.body;
    const savedResult = await redisClient.setAsync('webHookUrl', url);
    res.json(savedResult);
  }catch(err) {
    next(err)
  }
}

