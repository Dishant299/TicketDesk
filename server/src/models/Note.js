const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    ticketId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    content:{
        type: String,
        required: true,
        trim: true,
    },
    author:{
        type: String,
        required: true,
        trim: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Note', noteSchema);
