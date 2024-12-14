import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query tools for mutation and query management
import toast from "react-hot-toast"; // Import toast for displaying notifications

// Custom hook to handle user profile updates
const useUpdateUserProfile = () => {
	const queryClient = useQueryClient(); // Access the query client instance for managing cache

	// Define a mutation for updating the user profile
	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			// Function to send the profile update request to the API
			try {
				const res = await fetch(`/api/users/update`, {
					method: "POST", // API method for updating the profile
					headers: {
						"Content-Type": "application/json", // Specify JSON content type
					},
					body: JSON.stringify(formData), // Convert form data to JSON
				});
				const data = await res.json();
				if (!res.ok) {
					// Handle non-OK API responses
					throw new Error(data.error || "Something went wrong");
				}
				return data; // Return the updated profile data
			} catch (error) {
				throw new Error(error.message); // Throw error to the mutation
			}
		},
		onSuccess: () => {
			// Callback executed when the mutation succeeds
			toast.success("Profile updated successfully"); // Show a success notification
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }), // Invalidate the authUser query to refetch user data
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }), // Invalidate the userProfile query to refresh the profile
			]);
		},
		onError: (error) => {
			// Callback executed when the mutation fails
			toast.error(error.message); // Show an error notification with the message
		},
	});

	// Return the updateProfile function and the loading state
	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile; // Export the custom hook
