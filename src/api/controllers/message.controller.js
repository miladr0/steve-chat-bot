const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const Message = require('../models/message.model');


/**
 * Get Message
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await Message.get(messageId);

    return res.json(message);
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
};

/**
 * Delete Message
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const deleteResult = await Message.deleteOne({ _id: messageId });
    if (deleteResult.n === 0) throw new APIError({ message: 'Message not found', status: httpStatus.NOT_FOUND });

    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

