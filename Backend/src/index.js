import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import { app } from "../app.js"
import connectDB from "./db/index.js"

import { createServer } from "http"
import { Server } from "socket.io"
import { setupSocket } from "./socket.js"

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true 
    },
    pingInterval: 25000,  
    pingTimeout: 60000
});


setupSocket(io, app)
app.set("io", io)

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Server connection error: ", err)
    })

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.log("Error in connection with mongoDB: ", err)
})

