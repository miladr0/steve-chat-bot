/* eslint consistent-return: 0 */
/* eslint : 0 */
const { fbVerifyToken } = require('../../config/vars');
const FaceBookService = require('../services/FacebookBot.service');
/**
 * 1- Verify end-point url and token
 * 2- set some init config for bot
 * @public
 */
exports.verifyWebHook = async (req, res, next) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === fbVerifyToken) {
      res.status(200).send(challenge);

      // init some default config for bot
      FaceBookService.setWelcomeMessage();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    return next(error);
  }
};


/**
 * Parse receive data from users and response with appreciate answer
 * @public
 */
exports.receiveWebHookData = async (req, res, next) => {
  try {
    // console.log(req.body)
    const { body } = req;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async (entry) => {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        const webhookEvent = entry.messaging[0];

        // Get the sender PSID
        const senderPsid = webhookEvent.sender.id;
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message && webhookEvent.message.quick_reply) {
          FaceBookService.handleQuickReply(senderPsid, webhookEvent.message.quick_reply);
        } else if (webhookEvent.message) {
          FaceBookService.messageHandler(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
          FaceBookService.handlePostBack(senderPsid);
        }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } catch (error) {
    return next(error);
  }
};
