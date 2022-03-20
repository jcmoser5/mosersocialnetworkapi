const moment = require('moment');
const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: 'Enter a reaction',
      maxlength: [280, 'Needs to be less than 280 characters']
    },
    username: {
      type: String,
      required: 'Enter your username'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

module.exports = ReactionSchema; 