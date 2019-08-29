const express = require('express');

const messageRoutes = require('./message.route');
const hookCallbackRoutes = require('./hookCallBack.router');


const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


router.use('/messages', messageRoutes);
router.use('/hook-callbacks', hookCallbackRoutes);


module.exports = router;
