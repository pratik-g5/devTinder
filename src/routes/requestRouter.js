const express = require('express');

const requestRouter = express.Router();
const ConnectionRequest = require('../models/requestModel');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

      if (!ObjectId.isValid(toUserId)) {
        throw new Error('Invalid user Id!');
      }

      const toUserInfo = await User.findById(toUserId);
      if (!toUserInfo) {
        throw new Error('User not found!');
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
