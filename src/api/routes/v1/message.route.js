const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/message.controller');
const {
  listMessages,
  getMessage,
  deleteMessage,
} = require('../../validations/message.validation');


const router = express.Router();
/**
 * @swagger
 * definitions:
 *   Message:
 *     properties:
 *        senderPsid:
 *          type: string
 *          description: unique ID of chat page
 *          required: true
 *        firstName:
 *          type: string
 *          description: name of user
 *          required: true
 *        birthday:
 *          type: string
 *          description: user birth day
 *        confirmation:
 *          type: string
 *          description: show him until next birth day or not
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

router
  .route('/')
  /**
   * @swagger
   * /v1/messages:
   *   get:
   *     tags:
   *       - Messages
   *     description: Get array of messages
   *     produces:
   *       - application/json
   *     parameters:
   *          - name: skip
   *            description: number of items to skip
   *            in: query
   *            schema:
   *              type: integer
   *              format: int32
   *          - name: limit
   *            in: query
   *            description: max records to return
   *            schema:
   *              type: integer
   *              format: int32
   *          - name: order
   *            in: query
   *            description: sort list of messages asc or desc
   *            schema:
   *              type: string
   *              enum:
   *                - 'asc'
   *                - 'desc'
   *              default: 'desc'
   *          - name: orderBy
   *            in: query
   *            description: sort by which property
   *            schema:
   *              type: string
   *              enum:
   *                - 'id'
   *              default: 'id'
   *
   *
   *
   *     responses:
   *       400:
   *        description: ValidationError  Some parameters may contain invalid values
   *       200:
   *         description: successfully get array of messages
   *         schema:
   *           type: array
   *           items:
   *            $ref: '#/definitions/Message'
   *
   */
  .get(validate(listMessages), controller.list);

router
  .route('/:messageId')
/**
   * @swagger
   * /v1/messages/{messageId}:
   *   get:
   *     tags:
   *       - Messages
   *     description: Get single message
   *     produces:
   *       - application/json
   *     parameters:
   *          - name: messageId
   *            description: mongodb id of message
   *            in: path
   *            required: true
   *            type: string
   *
   *
   *
   *     responses:
   *       400:
   *        description: ValidationError  Some parameters may contain invalid values
   *       200:
   *         description: successfully get message object
   *         schema:
   *           type: Object
   *           $ref: '#/definitions/Message'
   *
   */
  .get(validate(getMessage), controller.get)
/**
   * @swagger
   * /v1/messages/{messageId}:
   *   delete:
   *     tags:
   *       - Messages
   *     description: remove single message
   *     produces:
   *       - application/json
   *     parameters:
   *          - name: messageId
   *            description: mongodb id of message
   *            in: path
   *            required: true
   *            type: string
   *
   *
   *
   *     responses:
   *       400:
   *        description: ValidationError  Some parameters may contain invalid values
   *       200:
   *         description: successfully removed a message
   *
   */
  .delete(validate(deleteMessage), controller.remove);

module.exports = router;
