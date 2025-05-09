const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/requestModel');

const userRouter = express.Router();

const USER_DATA = 'firstName lastName age gender skills';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: 'interested',
    }).populate('fromUserId', USER_DATA);
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

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: 'accepted' },
        { toUserId: loggedInUserId, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_DATA)
      .populate('toUserId', USER_DATA);
    if (!connections) {
      throw new Error('No connections found!');
    }

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUserId)) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.send({
      message: 'Connections found!',
      data: data,
    });
  } catch (err) {
    res.status(500).send('ERROR: ' + err.message);
  }
});

module.exports = userRouter;
