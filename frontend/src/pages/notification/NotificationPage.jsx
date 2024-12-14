import { Link } from "react-router-dom"; // Import Link for navigation to user profiles
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Import LoadingSpinner for loading states

import { IoSettingsOutline } from "react-icons/io5"; // Import settings icon from react-icons
import { FaUser } from "react-icons/fa"; // Import user icon for "follow" notifications
import { FaHeart } from "react-icons/fa6"; // Import heart icon for "like" notifications

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query tools for query and mutation management
import toast from "react-hot-toast"; // Import toast for notifications

const NotificationPage = () => {
	const queryClient = useQueryClient(); // Access the query client instance for caching and refetching

	// Query to fetch notifications
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"], // Unique key for notifications query
		queryFn: async () => {
			// Fetch notifications from the API
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong"); // Handle API errors
				return data; // Return notifications data
			} catch (error) {
				throw new Error(error); // Handle fetch errors
			}
		},
	});

	// Mutation to delete all notifications
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			// Send DELETE request to the API
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE", // Use DELETE method to remove all notifications
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong"); // Handle API errors
				return data; // Return response data
			} catch (error) {
				throw new Error(error); // Handle fetch errors
			}
		},
		onSuccess: () => {
			// Callback executed on successful deletion
			toast.success("Notifications Deleted"); // Show success toast
			queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Refresh the notifications query
		},
		onError: (error) => {
			// Callback executed on error
			toast.error(error.message); // Show error toast
		},
	});

	return (
		<>
			{/* Main container for the NotificationPage */}
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				
				{/* Header with page title and settings dropdown */}
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown'>
						{/* Dropdown button */}
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						{/* Dropdown menu */}
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a> {/* Trigger deleteNotifications mutation */}
							</li>
						</ul>
					</div>
				</div>

				{/* Loading state */}
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' /> {/* Show loading spinner while fetching notifications */}
					</div>
				)}

				{/* No notifications state */}
				{notifications?.length === 0 && (
					<div className='text-center p-4 font-bold'>No notifications 🤔</div>
				)}

				{/* Render notifications */}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{/* Notification type icon */}
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							
							{/* Link to the profile of the user who triggered the notification */}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{/* Notification message */}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default NotificationPage; // Export the NotificationPage component
