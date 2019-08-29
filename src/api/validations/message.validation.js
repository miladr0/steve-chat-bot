const Joi = require('joi');

module.exports = {
  // GET /v1/messages
  listMessages: {
    query: {
      skip: Joi.number().min(1),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100),
      order: Joi.string().valid(['asc', 'desc']),
      orderBy: Joi.string().valid(['id']),
    },
  },

  // POST /v1/messages/set-web-hook
  setWebHook: {
    body: {
      url: Joi.string()
        .trim()
        .uri({ scheme: ['http', 'https'] }),
    },
  },

  // GET /v1/messages/:messageId
  getMessage: {
    params: {
      messageId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // DELETE /messages/:messageId
  deleteMessage: {
    params: {
      messageId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
