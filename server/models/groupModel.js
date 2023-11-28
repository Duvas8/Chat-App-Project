const mongoose = require('mongoose');

const Schema = mongoose.Schema

const groupSchema = new Schema({
  groupName: String,
  members:[{_id:String}],
  messages:[{text:String, sender:String}]
}, { versionKey: false });

const Group = mongoose.model('group', groupSchema);

module.exports = Group;