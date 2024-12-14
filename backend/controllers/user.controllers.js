// Import necessary libraries and models
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import Notification from "../models/notification.model.js";
import User from '../models/user.model.js';

// Controller to get a user's profile by username
export const getUserProfile = async(req, res) => {
    const { username } = req.params; // Extract the username from request parameters

    try {
        // Find the user by username, excluding the password field
        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Return the user details
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Controller to follow/unfollow a user
export const followUnFollowUser = async(req, res) => {
    try {
        const { id } = req.params; // Extract the target user ID from request parameters
        const userToModify = await User.findById(id); // Find the target user
        const currentUser = await User.findById(req.user._id); // Find the current logged-in user

        // Prevent following/unfollowing self
        if (id == req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        // Check if both users exist
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        // Check if the current user is already following the target user
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow the target user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow the target user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Create a follow notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });

            await newNotification.save();

            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.log("Error in followUnFollowUser: ", error.message);
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Controller to get suggested users to follow
export const getSuggestedUsers = async(req, res) => {
    try {
        const userId = req.user._id; // Get the current user ID

        // Get the list of users the current user is already following
        const usersFollowedByMe = await User.findById(userId).select("following");

        // Find random users excluding the current user
        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } }, // Exclude the current user
            { $sample: { size: 10 } }, // Get a random sample of 10 users
        ]);

        // Filter out users that are already followed
        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const getSuggestedUsers = filteredUsers.slice(0, 4); // Limit to 4 suggestions

        // Remove password from the user objects
        getSuggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(getSuggestedUsers); // Return the suggested users
    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

// Controller to update user profile details
export const updateUser = async(req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body; // Extract the image URLs from the request body

    const userId = req.user._id; // Get the current user ID

    try {
        let user = await User.findById(userId); // Find the user by ID
        if (!user) return res.status(404).json({ message: "User not found" });

        // Validate password updates
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password); // Verify current password
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            // Hash the new password and update
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile image update
        if (profileImg) {
            if (user.profileImg) {
                // Delete the existing profile image from Cloudinary
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg); // Upload new image
            profileImg = uploadedResponse.secure_url; // Save the new image URL
        }

        // Handle cover image update
        if (coverImg) {
            if (user.coverImg) {
                // Delete the existing cover image from Cloudinary
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg); // Upload new image
            coverImg = uploadedResponse.secure_url; // Save the new image URL
        }

        // Update user details
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save(); // Save the updated user

        // Exclude the password field in the response
        user.password = null;

        res.status(200).json(user); // Return the updated user details
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};