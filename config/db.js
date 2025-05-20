const mongoose = require("mongoose");
try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
} catch (err) {
    console.error(err)
}