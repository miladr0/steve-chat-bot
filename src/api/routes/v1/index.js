const express = require('express');

const messageRoutes = require('./message.route');


const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


router.use('/messages', messageRoutes);


module.exports = router;
