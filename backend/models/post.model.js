import mongoose from "mongoose";

// Define the schema for posts
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // The user who created the post
        ref: 'User', // Reference to the User model
        required: true,
    },
    text: {
        type: String, // Text content of the post
    },
    img: {
        type: String, // Image associated with the post
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId, // Users who liked the post
        ref: 'User',
    }],
    comments: [{
        text: {
            type: String, // Text content of the comment
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, // User who made the comment
            ref: 'User',
            required: true,
        },
    }],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create and export the Post model
const Post = mongoose.model("Post", postSchema);

export default Post;