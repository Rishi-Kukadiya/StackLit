export const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // Join room based on userId
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // Emit a notification to a user
        socket.on("send-notification", ({ receiverId, notification }) => {
            io.to(receiverId).emit("new-notification", notification);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};
