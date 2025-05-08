const mongoose = require('mongoose');

const requestModel = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested'],
        Message: '{VALUE} is not supported type',
      },
    },
  },
  {
    timestamps: true,
  }
);

const RequestModel = mongoose.model('Request', requestModel);
module.exports = RequestModel;
