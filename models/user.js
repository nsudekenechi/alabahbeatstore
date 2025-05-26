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

// userid, beatid, licesenseid, 
const Cart = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    cart: [
        {
            beat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "beat",
                required: [true, "Each beat in the cart must have a valid ID."],
                unique: [true, "You can't add two beats at same time"]
            },
            license: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "license",
                required: [true, "License must have a valid ID."]
            },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ],

});


module.exports = {
    User: mongoose.model("users", User),
    Cart: mongoose.model("cart", Cart)
};