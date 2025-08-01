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
        origin: "*", 
        methods: ["GET", "POST"]
    }
})
setupSocket(io, app)
app.set("io", io)

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Server connection error: ", err)
    })

    server.listen(process.env.PORT, () => {
        console.log("Server is running")
    })
}).catch((err) => {
    console.log("Error in connection with mongoDB: ", err)
})