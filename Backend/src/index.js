import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import { app } from "../app.js"
import connectDB from "./db/index.js"

import { createServer } from "http"
import { Server } from "socket.io"
import { setupSocket } from "./socket/socket.js"  

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
})

connectDB().then(() => {
    setupSocket(io); 

    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });

}).catch((err) => {
    console.log("MongoDB connection failed: ", err);
});
