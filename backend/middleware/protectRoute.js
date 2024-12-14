// Import necessary modules and models
import User from '../models/user.model.js';
import jwt from "jsonwebtoken";

export const protectRoute = async(req, res, next) => {
    try {
        // Retrieve the JWT token from cookies
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Find user
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Error: User not found" });
        }

        // Attach the user object to the request
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // Log any errors and return an internal server error response
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};