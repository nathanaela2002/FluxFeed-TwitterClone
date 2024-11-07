import mongoose from 'mongoose';
import User from './backend/models/user.model.js';

async function setDefaultCoverImg() {
    // Connect to MongoDB database
    await mongoose.connect('mongodb+srv://nathanaela2002:MEBTrua8o0A2T7b1@cluster0.zli1q.mongodb.net/twitter-db?retryWrites=true&w=majority&appName=Cluster0');

    try {
        // Log before running the update
        console.log("Starting update of coverImg for users...");

        // Update all users that don't have coverImg set
        const result = await User.updateMany({ coverImg: { $exists: false } }, // Only update users without coverImg
            { $set: { coverImg: "" } } // Set default value
        );

        // Log the result
        console.log("Update result:", result);
        console.log("Users updated:", result.modifiedCount || 0);
    } catch (error) {
        console.error("Error updating users:", error);
    } finally {
        mongoose.connection.close(); // Close the connection when done
    }
}

setDefaultCoverImg();