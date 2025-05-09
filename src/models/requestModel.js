const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
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

requestSchema.index({ fromUserId: 1, toUserId: 1 });

requestSchema.pre('save', function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('You cannot send a request to yourself!');
  }
  next();
});

const RequestModel = mongoose.model('Request', requestSchema);
module.exports = RequestModel;
