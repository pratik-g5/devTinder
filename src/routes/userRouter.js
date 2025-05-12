const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/requestModel');
const User = require('../models/userModel');
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

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    if (users.length === 0) {
      throw new Error('No users found!');
    }
    res.send(users);
  } catch (err) {
    res.status(500).send('ERROR: ' + err.message);
  }
});

module.exports = userRouter;
