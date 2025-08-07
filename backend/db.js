import mongoose from "mongoose";

// Creating the function for db connect

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO_DB CONNECTED");
    } catch(error){
        console.log("Error in connecting MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB
