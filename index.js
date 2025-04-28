require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const DB = require("./config/db"); //DB Connection
const authRoutes = require("./router/auth")
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/auth", authRoutes);
app.listen(port, () => console.log(`Server Started on http://localhost:${port}`));