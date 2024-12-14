// Import the jsonwebtoken library for generating and verifying JWTs
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    // Generate a JSON Web Token (JWT) using the user ID and a secret key from environment variables
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d", // The token will expire in 15 days
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // The cookie is accessible only via HTTP
        sameSite: "strict", // Restricts the cookie to same-site requests
        secure: process.env.NODE_ENV !== "development", // The cookie is sent over HTTPS only, except in development mode
    });
};