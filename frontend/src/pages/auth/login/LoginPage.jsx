import { useState } from "react"; // Import useState for managing form data
import { Link } from "react-router-dom"; // Import Link for navigation

import FFSvg from "../../../components/svgs/FF"; // Import custom logo SVG component

import { MdOutlineMail } from "react-icons/md"; // Import email icon from react-icons
import { MdPassword } from "react-icons/md"; // Import password icon from react-icons

import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query tools for mutation and query management
import toast from "react-hot-toast"; // Import toast for notifications

const LoginPage = () => {
	// State to manage form input values
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient(); // Access the query client instance for cache management

	// Mutation to handle login functionality
	const { mutate: loginMutation, isError, isPending, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			// Function to send login request to the API
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST", // Use POST method for login
					headers: {
						"Content-Type": "application/json", // Set content type as JSON
					},
					body: JSON.stringify({ username, password }), // Convert input data to JSON
				});

				const data = await res.json();

				if (!res.ok) {
					// Handle API errors
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error); // Throw fetch errors
			}
		},
		onSuccess: () => {
			toast.success("Login successful"); 
			queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate the authUser query to refetch user data
		},
	});

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		loginMutation(formData); // Trigger the login mutation with form data
	};

	// Handle input field changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value }); // Update the formData state
	};

	const { mutate: guestLoginMutation, isError: isGuestError, isPending: isGuestPending, error: guestError } = useMutation({
		mutationFn: async () => {
		  // Function to send guest login request to the API
		  try {
			const res = await fetch("/api/auth/login", {
			  method: "POST", // Use POST method for login
			  headers: {
				"Content-Type": "application/json", // Set content type as JSON
			  },
			  body: JSON.stringify({ username: "guest", password: "123456" }), // Hardcoded guest credentials
			});
	  
			const data = await res.json();
	  
			if (!res.ok) {
			  // Handle API errors
			  throw new Error(data.error || "Something went wrong");
			}
		  } catch (error) {
			throw new Error(error.message || "Fetch error"); // Throw fetch errors
		  }
		},
		onSuccess: () => {
		  toast.success("Guest login successful");
		  queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate the authUser query to refetch user data
		},
	  });
	  
	  // Function to trigger guest login
	  const loginAsGuest = () => {
		guestLoginMutation();
	  };

	  return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
		  {/* Left panel with logo (hidden on smaller screens) */}
		  <div className="flex-1 hidden lg:flex items-center justify-center">
			<FFSvg className="lg:w-2/3 fill-soft-purple" />
		  </div>
		  {/* Right panel with login form */}
		  <div className="flex-1 flex flex-col justify-center items-center">
			<form
			  className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
			  onSubmit={handleSubmit} // Handle form submission
			>
			  <FFSvg className="w-24 lg:hidden fill-soft-purple" /> {/* Logo for small screens */}
			  <h1 className="text-4xl font-extrabold text-custom-purple">{"Welcome"} Back!</h1>
	  
			  {/* Username input field */}
			  <label className="input input-bordered rounded flex items-center gap-4">
				<MdOutlineMail /> {/* Email icon */}
				<input
				  type="text"
				  className="grow"
				  placeholder="username"
				  name="username"
				  onChange={handleInputChange} // Handle input changes
				  value={formData.username} // Bind to username state
				/>
			  </label>
	  
			  {/* Password input field */}
			  <label className="input input-bordered rounded flex items-center gap-2">
				<MdPassword /> {/* Password icon */}
				<input
				  type="password"
				  className="grow"
				  placeholder="Password"
				  name="password"
				  onChange={handleInputChange} // Handle input changes
				  value={formData.password} // Bind to password state
				/>
			  </label>
	  
			  {/* Login button */}
			  <button className="btn rounded-full btn-primary text-white">
				{isPending ? "Loading..." : "Login"} {/* Show loading state if login is in progress */}
			  </button>
	  
			  {/* Login as Guest button */}
			  <button
				type="button" // Type "button" to avoid submitting the form
				className="btn rounded-full btn-secondary text-white"
				onClick={loginAsGuest} // Call the guest login function
			  >
				{isGuestPending ? "Loading..." : "Login as Guest"}
			  </button>
	  
			  {/* Error message */}
			  {isError && <p className="text-red-500">{error.message}</p>}
			  {isGuestError && <p className="text-red-500">{guestError.message}</p>}
			</form>
	  
			{/* Sign up link */}
			<div className="flex flex-col gap-2 mt-4">
			  <p className="text-custom-purple text-lg">{"Don't"} have an account?</p>
			  <Link to="/signup">
				<button className="btn rounded-full btn-primary text-white btn-outline w-full">
				  Sign up
				</button>
			  </Link>
			</div>
		  </div>
		</div>
	  );
	};
	  

export default LoginPage; // Export the LoginPage component
