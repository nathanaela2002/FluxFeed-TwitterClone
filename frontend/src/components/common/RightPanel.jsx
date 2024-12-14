import { Link } from "react-router-dom"; // Import Link for navigation to user profiles
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton"; // Import skeleton loader for loading state
import { useQuery } from "@tanstack/react-query"; // Import Tan Stack Query for fetching data
import LoadingSpinner from "./LoadingSpinner"; // Import LoadingSpinner for button loading state
import useFollow from "../../hooks/useFollow"; // Custom hook for follow functionality

const RightPanel = () => {

	// Fetch suggested users using Tan Stack Query
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"], // Unique key for caching the query
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested"); // Fetch suggested users from the API
				const data = await res.json();
				if (!res.ok) {
					// Handle response errors
					throw new Error(data.error || "Something went wrong!");
				}
				return data; // Return fetched data
			} catch (error) {
				throw new Error(error.message); // Handle fetch errors
			}
		},
	});

	const { follow, isPending } = useFollow(); // Custom hook for following users

	// Return empty div if no suggested users
	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'> {/* Only display on large screens */}
			<div className='bg-soft-purple p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* Show skeleton loaders while fetching data */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{/* Render suggested users when data is loaded */}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`} // Link to the user's profile
								className='flex items-center justify-between gap-4'
								key={user._id} // Unique key for each user
							>
								<div className='flex gap-2 items-center'>
									{/* User's avatar */}
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									{/* User's name and username */}
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									{/* Follow button */}
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault(); // Prevent navigation
											follow(user._id); // Trigger follow action
										}}
									>
										{isPending ? <LoadingSpinner size="sm" /> : "Follow"} {/* Show loading spinner if follow action is pending */}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};

export default RightPanel; // Export the RightPanel component
