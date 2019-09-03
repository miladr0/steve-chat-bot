const axios = require('axios');
const { fbAccessToken } = require('../../config/vars');
const yesno = require('../utils/yesnoClassification.util');
const redisClient = require('../../config/redisConnection').getConnection(); // require & connect
const { calculateNextBirthday } = require('../utils/calculateNextBirthday');
const Message = require('../models/message.model');
const moment = require('moment');


const sendMessagesUrl = token => `https://graph.facebook.com/v4.0/me/messages?access_token=${token}`;
const messengerProfileUrl = token => `https://graph.facebook.com/v4.0/me/messenger_profile?access_token=${token}`;


const setWelcomeMessage = async () => {
  try {
    // Set some default for our bot
    const messageData = {
      greeting: [
        {
          locale: 'default',
          text: 'Welcome!',
        },
      ],
      get_started: { payload: 'GET_STARTED' },
    };

    // Send the HTTP request to the Messenger Platform
    const url = messengerProfileUrl(fbAccessToken);
    const result = await axios.post(url, messageData);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle user messages when he is typing
 * @public
 */
const messageHandler = async (senderPsid, receivedMessage) => {
  try {
    const userStep = await redisClient.hgetAsync(`chat_${senderPsid}`, 'step');
    // Check if the message contains text
    if (receivedMessage.text) {
      if (userStep && userStep === 'FIRST_NAME') {
        await Promise.all([
          redisClient.hsetAsync(`chat_${senderPsid}`, 'firstName', receivedMessage.text, 'step', 'BIRTHDAY'),
          askUserBirthday(senderPsid),
        ]);
      } else if (userStep && userStep === 'BIRTHDAY') {
        const birthday = receivedMessage.text;
        if (moment(birthday, 'YYYY-MM-DD', true).isValid()) {
          await Promise.all([
            redisClient.hsetAsync(`chat_${senderPsid}`, 'birthday', birthday, 'step', 'CALCULATE_BIRTHDAY'),
            askCalculateBirthday(senderPsid),
          ]);
        } else {
          askUserBirthday(senderPsid);
        }
      } else if (userStep && userStep === 'CALCULATE_BIRTHDAY') {
        const confirmAnswer = receivedMessage.text;
        redisClient.hsetAsync(`chat_${senderPsid}`, 'confirmation', confirmAnswer, 'step', 'RESTART');

        if (yesno.yesValues().indexOf(confirmAnswer) >= 0) {
          showDaysUntilBirthday(senderPsid);
        } else {
          sendGoodbyMessage(senderPsid);
        }
      } else {
        resetQuestions(senderPsid);
      }
    } else {
      resetQuestions(senderPsid);
    }
  } catch (error) {
    throw error;
  }
};

/**
   * Handle user messages when he is using buttons
   * @public
   */
const handlePostBack = async (senderPsid, receivedPostBack) => {
  try {
    // Get the payload for the postback
    const { payload } = receivedPostBack;

    // Set the response based on the postback payload
    if (payload === 'YES') {
      showDaysUntilBirthday(senderPsid);
    } else if (payload === 'NO') {
      sendGoodbyMessage(senderPsid);
    } else if (payload === 'GET_STARTED') {
      resetQuestions(senderPsid);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * restart sequence of questions
 * @param {Number} senderPsid - Unique ID for the user
 *
 */
const resetQuestions = async (senderPsid) => {
  try {
    const welcomeMsgData = simpleMessageTemplate(senderPsid, 'Hi!');
    await Promise.all([
      callSendAPI(welcomeMsgData),
      redisClient.hsetAsync(`chat_${senderPsid}`, 'step', 'FIRST_NAME'),
    ]);

    askUserFirstName(senderPsid);
  } catch (error) {
    throw error;
  }
};

/**
 * First question from user
 * ask his first name
 * @param {Number} senderPsid - Unique ID for the user
 *
 */
const askUserFirstName = async (senderPsid) => {
  const askFirstQuestion = simpleMessageTemplate(senderPsid, 'Please enter your first name...');
  callSendAPI(askFirstQuestion);
};

/**
 * Second question from user
 * ask his birthday
 * @param {Number} senderPsid - Unique ID for the user
 *
 */
const askUserBirthday = async (senderPsid) => {
  const askFirstQuestion = simpleMessageTemplate(senderPsid, 'Please enter your birth date <YYYY-MM-DD>...');
  callSendAPI(askFirstQuestion);
};

/**
 * Third question from user
 * want calculate his next birth date or not.
 * @param {Number} senderPsid - Unique ID for the user
 *
 */
const askCalculateBirthday = (senderPsid) => {
  const calculateTemplate = {
    recipient: {
      id: senderPsid,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'show next birth date? ["y","yes","ok","yeah" or "n", "no", "nah"...]',
          buttons: [
            {
              type: 'postback',
              title: 'Yes',
              payload: 'YES',
            },
            {
              type: 'postback',
              title: 'No',
              payload: 'NO',
            },
          ],
        },
      },
    },
  };

  callSendAPI(calculateTemplate);
};

const sendGoodbyMessage = async (senderPsid) => {
  const goodbyMsg = simpleMessageTemplate(senderPsid, 'Goodbye 🙅');
  callSendAPI(goodbyMsg);

  // save all user inputs as single message in db
  const message = await redisClient.hgetallAsync(`chat_${senderPsid}`);
  message.senderPsid = senderPsid;
  const messageToSave = new Message(message);
  await messageToSave.save();
};

const showDaysUntilBirthday = async (senderPsid) => {
  const message = await redisClient.hgetallAsync(`chat_${senderPsid}`);
  callSendAPI(simpleMessageTemplate(senderPsid, calculateNextBirthday(message.birthday)));

  // save all user inputs as single message in db
  message.senderPsid = senderPsid;
  const messageToSave = new Message(message);
  await messageToSave.save();
};


const simpleMessageTemplate = (senderPsid, text) => ({
  recipient: {
    id: senderPsid,
  },
  message: { text },
});

// Sends response messages via the Send API
const callSendAPI = async (messageData) => {
  try {
    // Send the HTTP request to the Messenger Platform
    const url = sendMessagesUrl(fbAccessToken);
    const result = await axios.post(url, messageData);
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  messageHandler,
  handlePostBack,
  setWelcomeMessage,
};
