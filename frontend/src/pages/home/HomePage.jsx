import { useState } from "react"; // Import useState for managing local state

import Posts from "../../components/common/Posts"; // Import Posts component to display posts
import CreatePost from "./CreatePost"; // Import CreatePost component for post creation

const HomePage = () => {
	// State to manage the selected feed type ("forYou" or "following")
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			{/* Main container for the HomePage */}
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				
				{/* Header with navigation for "For You" and "Following" feeds */}
				<div className='flex w-full border-b border-gray-700'>
					{/* "For You" feed tab */}
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")} // Set feed type to "forYou" when clicked
					>
						For you
						{/* Highlight underline for the active tab */}
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>

					{/* "Following" feed tab */}
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")} // Set feed type to "following" when clicked
					>
						Following
						{/* Highlight underline for the active tab */}
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* CreatePost component for creating a new post */}
				<CreatePost />

				{/* Posts component to display posts based on the selected feed type */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};

export default HomePage; // Export the HomePage component
