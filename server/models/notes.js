const mongoose = require('mongoose');

const noteSchema  = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('notes', noteSchema);