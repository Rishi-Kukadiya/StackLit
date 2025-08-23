// [CHANGED BY GITHUB COPILOT]
// Basic socket setup with logging and user tracking
// filepath: e:\MERN-projects\stacklt\StackLit\Backend\src\socket.js
export function setupSocket(io, app) {
    // Store connected users: userId -> socketId
    const connectedUsers = new Map();
    app.set("connectedUsers", connectedUsers);

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth?.userId;
        if (userId) {
            connectedUsers.set(userId, socket.id);
            // console.log("User connected:", userId, socket.id);
        }

        socket.on("disconnect", () => {
            if (userId) {
                connectedUsers.delete(userId);
                // console.log("User disconnected:", userId);
            }
        });
    });
}