const mongoose = require('mongoose');

//use Schema constructor to define a schema instance
const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    linkUrl: { type: String, required: true },
    publisher: { type: String, required: true },
    publishDate: { type: String, required: true },
    uid: { type: String, required: true },
},
{
    collection: "noticeBoard"
});

module.exports = noticeSchema;