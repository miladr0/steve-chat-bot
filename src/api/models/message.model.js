/* eslint no-param-reassign: 0 */
/* eslint prefer-const: 0 */

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const MessageAggregatePaginate = require('../utils/MessageModelAggregatePagination');


/**
 * Message Schema
 * @private
 */
const messageSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  birthday: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  confirmation: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
}, { timestamps: true });


/**
 * Statics
 */
messageSchema.statics = {
  /**
   * Get message
   *
   * @param {ObjectId} id - The objectId of message.
   * @returns {Promise<Message, APIError>}
   */
  async get(id) {
    try {
      let message;

      if (mongoose.Types.ObjectId.isValid(id)) {
        message = await this.findById(id).exec();
      }
      if (message) {
        return message;
      }

      throw new APIError({
        message: 'Message does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * @typedef list
   * get list of messages with pagination.
   * @param {number} skip - Number of messages to be skipped.
   * @param {number} limit - Limit number of messages to be returned.
   * @param {String} order - sort list of messages asc or desc
   * @param {String} orderBy - sort by which property [default is "id" ]
   * @returns {Promise<Message>}
   */
  async list({
    skip = 1,
    limit = 10,
    order = 'desc',
    orderBy = 'id',
  }) {
    let sort = -1; // descending
    if (order === 'asc') sort = 1; // ascending
    if (orderBy === 'id') orderBy = '_id';

    const options = {
      limit,
      page: skip,
      customLabels: {
        docs: 'messages',
        totalDocs: 'total_count',
        totalPages: 'page_count',
      },
    };

    const needQuery = [];
    let documentCountQuery;

    // sort returned messages.
    needQuery.push({ $sort: { [orderBy]: sort } });
    // query for count documents
    documentCountQuery = [...needQuery];
    // put pagination pipeline.
    const page = parseInt(skip, 10);
    const limitCalculate = parseInt(limit, 10);
    const skipCalculate = (page - 1) * limitCalculate;

    needQuery.push({ $skip: skipCalculate });
    needQuery.push({ $limit: limitCalculate });


    const [messages, countMessages] = await Promise.all([
      this.aggregate(needQuery),
      this.aggregate(documentCountQuery).group({
        _id: null,
        count: {
          $sum: 1,
        },
      }),
    ]);
    const result = { [options.customLabels.docs]: messages };
    const countPagination = MessageAggregatePaginate(countMessages, options);
    return Object.assign(result, countPagination);
  },

};

/**
 * @typedef Message
 */
messageSchema.index({ name: 1 });

module.exports = mongoose.model('Message', messageSchema);
