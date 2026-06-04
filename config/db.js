const mongoose = require("mongoose")
let isConnected = false;
const MONGODB_URI = process.env.MONGODB_URI;
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
}
async function DB() {

    mongoose.set("strictQuery", true); // Best practice for Mongoose 7/8

    if (isConnected) return;

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            appName: "ajempirebackend",
            bufferCommands: false, // Don't wait for DB if it's disconnected
            maxPoolSize: 10, // Adjust based on Railway plan
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        isConnected = !!db?.connections[0]?.readyState;

        // CREATING ADMIN INCASE NOT CREATED
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (adminExists) {
            return;
        }
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const hashPassword = await bcrypt.hash(adminPassword, 10);
        const user = await User.create({ email: adminEmail, password: hashPassword, fullname: "Admin", role: "admin" });
       
        console.log("MongoDB Connected Successfully ✅");
    } catch (err) {
        console.error("MongoDB connection failed ❌", err);
        // Don't throw a generic error; let the caller handle it or exit
        process.exit(1);
    }
}

module.exports = DB;