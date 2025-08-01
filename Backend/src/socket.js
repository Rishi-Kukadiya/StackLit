
export const setupSocket = (io, app) => {
    const connectedUsers = new Map();
    app.set("connectedUsers", connectedUsers);

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // Join room based on userId
        socket.on("join", (userId) => {
            socket.join(userId);
            connectedUsers.set(userId, socket.id);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // Remove user from map on disconnect
        socket.on("disconnect", () => {
            for (const [userId, sId] of connectedUsers.entries()) {
                if (sId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }
            console.log("User disconnected", socket.id);
        });
    });
};