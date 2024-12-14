import mongoose from 'mongoose';

// Define the schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String, // Unique username for the user
        required: true,
        unique: true,
    },
    fullName: {
        type: String, // Full name of the user
        required: true,
    },
    password: {
        type: String, // Hashed password of the user
        required: true,
        minLength: 6, // Minimum password length
    },
    email: {
        type: String, // Unique email address
        required: true,
        unique: true,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectID, // Users following this user
        ref: "User", // Reference to the User model
        default: [],
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectID, // Users this user is following
        ref: "User", // Reference to the User model
        default: [],
    }],
    profileImg: {
        type: String, // URL of the user's profile image
        default: "",
    },
    coverImg: {
        type: String, // URL of the user's cover image
        default: "",
    },
    bio: {
        type: String, // Short biography of the user
        default: "",
    },
    link: {
        type: String, // Optional link (e.g., personal website)
        default: "",
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId, // Posts liked by the user
        ref: "Posts", // Reference to the Posts model
        default: [],
    }],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;