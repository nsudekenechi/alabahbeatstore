const mongoose = require("mongoose");

const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})

module.exports = mongoose.model("users", User);