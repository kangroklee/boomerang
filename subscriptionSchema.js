const mongoose = require('mongoose');

//use Schema constructor to define a schema instance
const subscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    } 
});

module.exports = subscriptionSchema;