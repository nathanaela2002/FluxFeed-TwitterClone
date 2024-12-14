import { CiImageOn } from "react-icons/ci"; // Import image upload icon
import { BsEmojiSmileFill } from "react-icons/bs"; // Import emoji icon
import { useRef, useState } from "react"; // Import hooks for managing state and refs
import { IoCloseSharp } from "react-icons/io5"; // Import close icon
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import TanStack Query for data mutation and caching
import toast from "react-hot-toast"; // Import toast for notifications

const CreatePost = () => {
	// State to manage post text and selected image
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	// Reference to the file input element for image uploads
	const imgRef = useRef(null);

	// Query to fetch the authenticated user data
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	// Access the query client to manage query cache
	const queryClient = useQueryClient();

	// Mutation to handle creating a new post
	const { mutate: createPost, isPending, isError, error } = useMutation({
		mutationFn: async ({ text, img }) => {
			// API call to create a new post
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST", // Use POST method for creating the post
					headers: {
						"Content-Type": "application/json", // Specify JSON content type
					},
					body: JSON.stringify({ text, img }), // Convert post data to JSON
				});
				const data = await res.json();
				if (!res.ok) {
					// Handle API errors
					throw new Error(data.error || "Something went wrong");
				}
				return data; // Return the response data
			} catch (error) {
				throw new Error(error); // Pass the error to the mutation handler
			}
		},
		onSuccess: () => {
			// Reset form state on successful post creation
			setText("");
			setImg(null);
			toast.success("Post created successfully"); // Show success notification
			queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh the posts query
		},
	});

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		createPost({ text, img }); // Trigger the mutation with post data
	};

	// Handle image file selection
	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader(); // Create a FileReader to read the file
			reader.onload = () => {
				setImg(reader.result); // Set the image preview
			};
			reader.readAsDataURL(file); // Read the file as a data URL
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			{/* User avatar */}
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>

			{/* Post creation form */}
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				{/* Text input for the post */}
				<textarea
					className='textarea w-full p-2 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)} // Update text state on change
				/>

				{/* Image preview */}
				{img && (
					<div className='relative w-72 mx-auto'>
						{/* Close icon to remove the selected image */}
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null); // Clear the image state
								imgRef.current.value = null; // Reset the file input value
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' /> {/* Display the image preview */}
					</div>
				)}

				{/* Action buttons and icons */}
				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					{/* Image upload and emoji icons */}
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()} // Trigger the file input click
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>

					{/* Hidden file input for image selection */}
					<input
						type='file'
						accept='image/*'
						hidden
						ref={imgRef} // Reference to the input element
						onChange={handleImgChange} // Handle image file selection
					/>

					{/* Submit button */}
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"} {/* Show loading state while posting */}
					</button>
				</div>

				{/* Error message */}
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost; // Export the CreatePost component
