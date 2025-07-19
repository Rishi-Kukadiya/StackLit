import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import { app } from "../app.js"
import connectDB from "./db/index.js"

connectDB().then(() => {

    app.on("error", (err) => {
        console.log("Server connection error: ", err);

    })

    app.listen(process.env.PORT, () => {
        console.log("Server is running");
    })
}).catch((err) => {
    console.log("Error in connection ith mongoDB: ", err);

})

