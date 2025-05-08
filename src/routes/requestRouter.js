const express = require('express');

const requestRouter = express.Router();
const ConnectionRequest = require('../models/requestModel');
const { userAuth } = require('../middlewares/auth');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const ALLOWED_STATUS = ['ignored', 'interested'];

      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error('Invalid status type!');
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const isExistingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isExistingRequest) {
        throw new Error('Request already exists!');
      }

      const savedRequest = await connectionRequest.save();
      res.json({
        message: 'Request sent successfully!',
        request: savedRequest,
      });
    } catch (err) {
      res.status(500).send('ERROR : ' + err.message);
    }
  }
);

module.exports = requestRouter;
