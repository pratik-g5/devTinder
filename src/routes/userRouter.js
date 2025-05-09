const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/requestModel');

const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName age gender skills');
    if (!connectionRequests) {
      throw new Error('No connection requests found!');
    }

    res.send({
      message: 'Connection requests found!',
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(400).send('ERROR: ' + err.message);
  }
});

module.exports = userRouter;
