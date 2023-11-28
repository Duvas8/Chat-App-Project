const mongoose = require('mongoose');

const Schema = mongoose.Schema

const privetConverstionSchema = new Schema({
  members:[{_id: String, memberName:String }],
  messages:[{text:String, sender:String}]
}, { versionKey: false });

const PrivetConverstion = mongoose.model('privetConverstion', privetConverstionSchema);

module.exports = PrivetConverstion;