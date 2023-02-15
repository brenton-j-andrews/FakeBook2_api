const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username : {
    type: String,
    required: true,
    unique: true,
    max: 25
  },
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
  userData : {
    location : { 
      type: String,
      default: ""
    },
    hometown : {
      type: String,
      default: ""
    },
    education : {
      type: String,
      default: ""
    },
    occupation: {
      type: String,
      default: ""
    }
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
  sentFriendRequests : {
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
  timestamps : true,
  toJSON: {virtuals : true}
});


module.exports = mongoose.model("User", UserSchema);