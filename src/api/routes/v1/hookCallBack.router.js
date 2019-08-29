const express = require('express');
const controller = require('../../controllers/hookCallBack.controller');


const router = express.Router();


router
  .route('/receive-data')
//       /**
//    * @swagger
//    * /v1/hook-callbacks/receive-data:
//    *   post:
//    *     tags:
//    *       - HookCallbacks
//    *     description: receive message data from webhook server
//    *     produces:
//    *       - application/json
//    *
//    *
//    *
//    *     responses:
//    *       200:
//    *         description: successfully parsed the message
//    *
//    */
  .post(controller.receiveWebHookData);


module.exports = router;
