const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  phoneNumber: Number,
  roles:{},
  contacts:[{_id:String ,contactName:String , phoneNumber:Number}],
  groups:[{groupId:String}],
  blockedContacts:[{type:String}],
  refreshToken: String
}, { versionKey: false });

const User = mongoose.model('user', userSchema);

module.exports = User;