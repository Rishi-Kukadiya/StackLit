import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        const connection = await mongoose.connect(`${uri}`);
        console.log("MongoDB connected successfully.");
        // console.log(connection);


    } catch (error) {
        console.log("ERROR: ", error);
        process
    }
}


export default connectDB;