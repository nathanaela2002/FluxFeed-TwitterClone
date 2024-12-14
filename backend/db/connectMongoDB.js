// Import the mongoose library for interacting with MongoDB
import mongoose from "mongoose";

const connectMongoDB = async() => {
    try {
        // Attempt to connect to the MongoDB database using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);

        // Exit the application with an error code (1) if the connection fails
        process.exit(1);
    }
}

// Export the function so it can be imported and used in other files
export default connectMongoDB;