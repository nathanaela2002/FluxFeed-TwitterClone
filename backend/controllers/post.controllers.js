// Import necessary models and libraries
import User from '../models/user.model.js';
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from 'cloudinary';

// Controller to create a new post
export const createPost = async(req, res) => {
    try {
        const { text } = req.body; // Extract text from the request body
        let { img } = req.body; // Extract img (image URL) from the request body
        const userId = req.user._id.toString(); // Get current user ID

        const user = await User.findById(userId); // Verify user existence
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!text && !img) {
            // Ensure the post has at least text or an image
            return res.status(400).json({ error: "Post must have text or image" });
        }

        if (img) {
            // If an image is provided, upload it to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url; // Save the secure image URL
        }

        // Create a new post object
        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save(); // Save the post to the database
        res.status(201).json(newPost); // Return the created post
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error);
    }
};

// Controller to delete a post
export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id); // Find post by ID
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Ensure that only the post owner can delete it
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        // If the post has an image, delete it from Cloudinary
        if (post.img) {
            const imgUrlParts = post.img.split('/');
            const imgIdWithExtension = imgUrlParts[imgUrlParts.length - 1];
            const imgId = imgIdWithExtension.split('.')[0]; // Extract the image ID
            await cloudinary.uploader.destroy(imgId); // Delete the image
        }

        await Post.findByIdAndDelete(req.params.id); // Delete the post itself
        res.status(200).json({ message: "Post and associated image deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to add a comment to a post
export const commentOnPost = async(req, res) => {
    try {
        const { text } = req.body; // Extract text from request body
        const postId = req.params.id; // Extract post ID from request params
        const userId = req.user._id; // Get current user ID

        if (!text) {
            // Ensure a comment has text
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId); // Find the post
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const comment = { user: userId, text }; // Create a new comment object
        post.comments.push(comment); // Add the comment to the post
        await post.save(); // Save the post with the new comment

        res.status(200).json(post); // Return the updated post
    } catch (error) {
        console.log("Error in commentOnPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to like or unlike a post
export const likeUnlikePost = async(req, res) => {
    try {
        const userId = req.user._id; // Get current user ID
        const { id: postId } = req.params; // Extract post ID from request params

        const post = await Post.findById(postId); // Find the post
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId); // Check if the user already liked the post

        if (userLikedPost) {
            // Unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes); // Return updated likes
        } else {
            // Like the post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            // Create a notification for the post owner
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            res.status(200).json(post.likes); // Return updated likes
        }
    } catch (error) {
        console.log("Error in likeUnlikePost Controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get all posts
export const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort posts by most recent
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts); // Return all posts
    } catch (error) {
        console.log("Error in getAllPosts Controllers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get liked posts of a user
export const getLikedPosts = async(req, res) => {
    const userId = req.params.id; // Extract user ID from request params

    try {
        const user = await User.findById(userId); // Find the user
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find posts liked by the user
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(likedPosts); // Return liked posts
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get posts from users the current user is following
export const getFollowingPosts = async(req, res) => {
    try {
        const userId = req.user._id; // Get current user ID
        const user = await User.findById(userId); // Find the user
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following; // Get list of followed users
        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 }) // Sort by most recent
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts); // Return feed posts
    } catch (error) {
        console.log("Error in getFollowingPosts Controllers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get posts by a specific user
export const getUserPosts = async(req, res) => {
    try {
        const { username } = req.params; // Extract username from request params

        const user = await User.findOne({ username }); // Find user by username
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find posts by the user
        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 }) // Sort by most recent
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts); // Return the user's posts
    } catch (error) {
        console.log("Error in getUserPosts Controllers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}