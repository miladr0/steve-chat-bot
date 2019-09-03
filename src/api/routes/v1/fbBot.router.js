const express = require('express');
const controller = require('../../controllers/fbBot.controller');


const router = express.Router();


router
  .route('/webhook')
/**
   * @swagger
   * /v1/bots/webhook:
   *   get:
   *     tags:
   *       - Webhook
   *     description: Facebook verification endpoint
   *     produces:
   *       - application/json
   *
   *
   *
   *     responses:
   *       200:
   *         description: successfully facebook set this endpoint for sending data
   *
   */
  .get(controller.verifyWebHook)
/**
   * @swagger
   * /v1/bots/webhook:
   *   post:
   *     tags:
   *       - Webhook
   *     description: Receive messages from Facebook
   *     produces:
   *       - application/json
   *
   *
   *
   *     responses:
   *       200:
   *         description: successfully receive the data
   *
   */
  .post(controller.receiveWebHookData);


module.exports = router;
