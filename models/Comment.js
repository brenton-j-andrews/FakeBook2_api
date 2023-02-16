const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  
  postId : {
    type: String,
  },

  commenterId : {
    type : String
  },

  commenterUsername : { 
    type : String, 
  },

  commenterFullName : {
    type : String,
  },

  commenterProfileImageUrl : {
    type : String
  },

  commentContent : {
    type : String,
  },

  commentLikes : {
    type : Array,
    default : []
  }

}, {
  timestamps : true
});

module.exports = mongoose.model("Comment", CommentSchema);