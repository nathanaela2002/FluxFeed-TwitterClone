import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query tools for mutations and query management
import toast from "react-hot-toast"; // Import toast for displaying notifications

// Custom hook to handle the follow action
const useFollow = () => {
    const queryClient = useQueryClient(); // Access the query client instance for managing cache

    // Define a mutation for the follow action
    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            // Function to send a follow request to the API
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST", // POST method for the follow action
                });

                const data = await res.json();
                if (!res.ok) {
                    // Throw an error if the API response is not OK
                    throw new Error(data.error || "Something went wrong!");
                }
                return; // Successfully completed follow action
            } catch (error) {
                throw new Error(error.message); // Handle and throw fetch errors
            }
        },
        onSuccess: () => {
            // Invalidate queries to refetch data and update the UI
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }), // Refresh suggested users
                queryClient.invalidateQueries({ queryKey: ["authUser"] }), // Refresh the authenticated user data
            ]);
        },
        onError: (error) => {
            // Show an error toast notification if the follow action fails
            toast.error(error.message);
        },
    });

    // Return the follow function and its loading state
    return { follow, isPending };
};

export default useFollow; // Export the custom hook
