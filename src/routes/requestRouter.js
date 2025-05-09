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

      const { toUserId, status } = req.params;
      const fromUserId = req.user._id;

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

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInuser = req.user;

      const ALLOWED_STATUS = ['accepted', 'rejected'];
      const { status, requestId } = req.params;

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error('Invalid status type!');
      }
      if (!ObjectId.isValid(requestId)) {
        throw new Error('Invalid request Id!');
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInuser._id,
        status: 'interested',
      });

      if (!connectionRequest) {
        throw new Error('Connection Request not found!');
      }

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();
      res.json({
        message: 'Request status updated successfully!',
        request: updatedRequest,
      });
    } catch (err) {
      res.status(500).send('ERROR : ' + err.message);
    }
  }
);

module.exports = requestRouter;
