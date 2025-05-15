// socket.js
const { Server } = require("socket.io");

let io;

function setupSocketIO(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

// 👇 Export accessor to use in controllers
function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}

module.exports = {
    setupSocketIO,
    getIO
};

