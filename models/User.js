const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email : {
    type: String,
    require: true,
    max: 50,
    unique: true
  },
  firstName : {
    type: String,
    require: true,
    min: 3,
    max: 25,
  },
  lastName : {
    type: String,
    require: true,
    min: 3,
    max: 25,
  },
  password : {
    type: String,
    require: true,
    min: 6,
    max: 20
  },
  profileImageUrl : {
    type: String,
    default: ""
  },
  coverImageUrl : {
    type: String,
    default: ""
  },
  profileStatement : {
    type: String,
    default: ""
  },
  friends : {
    type: Array,
    default: []
  },
  sendFriendRequests : {
    type: Array,
    default: []
  },
  receivedFriendRequests : {
    type: Array,
    default: []
  },
  isAdministrator : {
    type: Boolean,
    default: false
  }
}, {
  timestamps : true
});

module.exports = mongoose.model("User", UserSchema);