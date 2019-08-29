

/**
 * Receive Message data from webhook server
 * @public
 */
exports.receiveWebHookData = async (req, res, next) => {
  try {
    return res.json(req.body);
  } catch (error) {
    return next(error);
  }
};
