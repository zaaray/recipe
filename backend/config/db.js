import mongoose from 'mongoose';

import dotenv from 'dotenv';
// parses .env and creates an object
dotenv.config();


// this function is used to connect to the database 
// it is async because it returns a promise 
// because we are using 
export const connectDB = async () => {
    try {
        // uses the environment object from .env file 
        // (which is loaded into process.env by dotenv)
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB :)');
    } catch (error) {
        console.error('Error: ${error.message}');
        // 1 = exit with failure 
        // 0 = success 
        process.exit(1);
    }
}