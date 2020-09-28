const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ConversationSchema = new Schema({
    userIds: {
        type: Array,
        required: true
    },
    names: {
        type: Array
    },
    messages: {
        type: Array
    }
});

module.exports = Conversation = mongoose.model('Conversations', ConversationSchema);