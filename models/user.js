const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    nickname: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    flags: {
        version: {type: String, required: true},
        emailConfirmed: {type: String, required: true},
    }
});

module.exports = mongoose.model('User', userSchema);