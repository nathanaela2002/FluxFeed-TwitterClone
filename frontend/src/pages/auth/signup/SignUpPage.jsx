import { Link } from "react-router-dom"; // Import Link for navigation
import { useState } from "react"; // Import useState for managing form data

import FFSvg from "../../../components/svgs/FF"; // Import custom logo SVG component

import { MdOutlineMail } from "react-icons/md"; // Import email icon from react-icons
import { FaUser } from "react-icons/fa"; // Import user icon from react-icons
import { MdPassword } from "react-icons/md"; // Import password icon from react-icons
import { MdDriveFileRenameOutline } from "react-icons/md"; // Import name icon from react-icons

import { useMutation } from "@tanstack/react-query"; // Import TanStack Query tools for mutation
import toast from "react-hot-toast"; // Import toast for notifications

const SignUpPage = () => {
	// State to manage form input values
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	// Mutation to handle sign-up functionality
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			// Function to send sign-up request to the API
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST", // Use POST method for creating an account
					headers: {
						"Content-Type": "application/json", // Set content type as JSON
					},
					body: JSON.stringify({ email, username, fullName, password }), // Convert input data to JSON
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account"); // Handle API errors
				console.log(data); // Log the API response for debugging
				return data; // Return the response data
			} catch (error) {
				console.error(error); // Log the error for debugging
				toast.error(error.message); // Show error notification
				throw error; // Throw the error to the mutation handler
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully"); 
			queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate the authUser query to refetch user data
		},
	});

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		mutate(formData); // Trigger the mutation with form data
	};

	// Handle input field changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value }); // Update the formData state
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			{/* Left panel with logo (hidden on smaller screens) */}
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<FFSvg className=' lg:w-2/3 fill-soft-purple' />
			</div>
			{/* Right panel with sign-up form */}
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form
					className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col'
					onSubmit={handleSubmit} // Handle form submission
				>
					<FFSvg className='w-24 lg:hidden fill-soft-purple' /> {/* Logo for small screens */}
					<h1 className='text-4xl font-extrabold text-grey-700'>Join today.</h1>

					{/* Email input field */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail /> {/* Email icon */}
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange} // Handle input changes
							value={formData.email} // Bind to email state
						/>
					</label>

					{/* Username and Full Name input fields */}
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser /> {/* Username icon */}
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange} // Handle input changes
								value={formData.username} // Bind to username state
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline /> {/* Full Name icon */}
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange} // Handle input changes
								value={formData.fullName} // Bind to fullName state
							/>
						</label>
					</div>

					{/* Password input field */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword /> {/* Password icon */}
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange} // Handle input changes
							value={formData.password} // Bind to password state
						/>
					</label>

					{/* Sign-up button */}
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Sign up"} {/* Show loading state if mutation is in progress */}
					</button>

					{/* Error message */}
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>

				{/* Log in link */}
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-custom-purple text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Log In</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage; // Export the SignUpPage component
