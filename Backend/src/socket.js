export function setupSocket(io, app) {
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