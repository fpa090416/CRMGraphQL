const mongoose = require('mongoose');

const LoginSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fecha:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Login', LoginSchema);
