import { useEffect, useState } from "react"; // Import hooks for managing state and effects
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile"; // Import custom hook for updating user profile

// Component to display and manage the Edit Profile modal
const EditProfileModal = ({ authUser }) => {
	// State to manage the form data for profile editing
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	// Destructure updateProfile function and loading state from the custom hook
	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	// Handle input field changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value }); // Update formData state with the new input value
	};

	// Populate the form with the authenticated user's data when the component mounts or authUser changes
	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			{/* Button to open the Edit Profile modal */}
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			{/* Modal for editing the profile */}
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>

					{/* Form to update profile information */}
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault(); // Prevent default form submission
							updateProfile(formData); // Trigger profile update
						}}
					>
						{/* Input fields for full name and username */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>

						{/* Input fields for email and bio */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>

						{/* Input fields for current and new passwords */}
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>

						{/* Input field for personal link */}
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						{/* Update button */}
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"} {/* Show loading state if updating */}
						</button>
					</form>
				</div>

				{/* Modal backdrop for closing */}
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal; // Export the EditProfileModal component
