import Post from "./Post"; // Import the Post component to render individual posts
import PostSkeleton from "../skeletons/PostSkeleton"; // Import skeleton loader for loading state
import { useQuery } from "@tanstack/react-query"; // Import Tan Stack Query for data fetching
import { useEffect } from "react"; // Import useEffect to handle side effects

const Posts = ({ feedType, username, userId }) => {
	// Determines the API endpoint based on the feed type
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou": // Fetch all posts for the "For You" feed
				return "/api/posts/all";
			case "following": // Fetch posts from followed users
				return "/api/posts/following";
			case "posts": // Fetch posts by a specific user
				return `/api/posts/user/${username}`;
			case "likes": // Fetch posts liked by a specific user
				return `/api/posts/likes/${userId}`;
			default: // Default to all posts
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint(); // Get the API endpoint based on feed type

	// Use Tan Stack Query to fetch posts data
	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"], // Query key for caching and refetching
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT); // Fetch data from the determined endpoint
				const data = await res.json();

				if (!res.ok) {
					// Throw an error if the response is not OK
					throw new Error(data.error || "Something went wrong");
				}

				return data; // Return the fetched data
			} catch (error) {
				throw new Error(error); // Handle fetch errors
			}
		},
	});

	// Refetch posts whenever feedType, username, or refetch function changes
	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{/* Display skeleton loaders while posts are loading or refetching */}
			{(isLoading || isRefetching) && (
				<div className="flex flex-col justify-center">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{/* Display message if there are no posts */}
			{(!isLoading && !isRefetching) && posts?.length === 0 && (
				<p className="text-center my-4">No posts in this tab. Switch 👻</p>
			)}

			{/* Render posts if they are available */}
			{(!isLoading && !isRefetching) && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} /> // Render each post using the Post component
					))}
				</div>
			)}
		</>
	);
};

export default Posts; // Export the Posts component
