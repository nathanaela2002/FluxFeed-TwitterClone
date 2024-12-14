// Import necessary modules and libraries
import path from "path";
import express from "express";
import dotenv from "dotenv"; // Load environment variables
import cookieParser from "cookie-parser"; // Parse cookies
import { v2 as cloudinary } from "cloudinary"; // Cloudinary for image upload management

// Import route handlers
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

// Import the function to connect to MongoDB
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config(); // Load environment variables from the .env file

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // resolve to root directory

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON payloads with a size limit
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(cookieParser()); // Parse cookies

// Define API routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/posts", postRoutes); // Post-related routes
app.use("/api/notifications", notificationRoutes); // Notification-related routes

// Serve static files and handle production build
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serve static files from the frontend build directory

    // Catch-all route to serve the React frontend for any undefined routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and connect to MongoDB
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB(); // Establish the database connection
});