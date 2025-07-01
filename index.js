require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const port = process.env.PORT || 3001;
const http = require("http")
const DB = require("./config/db");
const authRoutes = require("./router/auth");
const adminRoutes = require("./router/admin");
const userRoutes = require("./router/user");
const { authenticate, authorizeAdmin } = require("./middlewares/auth");
const { setupSocketIO } = require("./config/socket");

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const server = http.createServer(app);

DB();
setupSocketIO(server);

// Protected routes
app.use("/api/admin", authenticate, authorizeAdmin, adminRoutes);

// Public routes
app.get("/", (req, res) => res.json("Route is working fine"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

server.listen(port, () => console.log(`Server Started on http://localhost:${port}`));