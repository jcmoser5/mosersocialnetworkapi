const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'Please enter a username',
      trim: true
    },
    email: {
      type: String,
      required: 'Please enter a valid email',
      unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [],
    friends: []
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User; 