const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    secretAnswer: {
        type: String,
        required: true,
    },
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;