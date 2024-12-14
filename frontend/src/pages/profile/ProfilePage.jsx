import { useEffect, useRef, useState } from "react"; // Hooks for managing state, refs, and side effects
import { Link, useParams } from "react-router-dom"; // For navigation and getting route parameters

import Posts from "../../components/common/Posts"; // Component to display posts
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton"; // Skeleton for loading state
import EditProfileModal from "./EditProfileModal"; // Modal for editing profile

import { POSTS } from "../../utils/db/dummy"; // Dummy posts for display

import { FaArrowLeft } from "react-icons/fa6"; // Back arrow icon
import { IoCalendarOutline } from "react-icons/io5"; // Calendar icon
import { FaLink } from "react-icons/fa"; // Link icon
import { MdEdit } from "react-icons/md"; // Edit icon

import { useQuery, useQueryClient } from "@tanstack/react-query"; // For fetching and caching data

import { formatMemberSinceDate } from "../../utils/date"; // Utility to format "Member Since" date

import useFollow from "../../hooks/useFollow"; // Custom hook for follow/unfollow functionality
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile"; // Custom hook for updating user profile

const ProfilePage = () => {
    // Query client for cache management
    const queryClient = useQueryClient();

    // State to manage images and feed type
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");

    // Refs for file inputs
    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);

    // Get the username from the route
    const { username } = useParams();

    // Custom hook for follow/unfollow functionality
    const { follow, isPending } = useFollow();

    // Query to get authenticated user data
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    // Query to get the profile data of the user being viewed
    const { data: user, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`); // Fetch the profile data
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong"); // Handle API errors
                }
                return data;
            } catch (error) {
                throw new Error(error); // Throw fetch errors
            }
        },
        onSuccess: (data) => {
            setCoverImg(data.coverImg); // Set the user's cover image
        },
    });

    // Check if this profile belongs to the authenticated user
    const isMyProfile = authUser._id === user?._id;

    // Format the "Member Since" date
    const memberSinceDate = formatMemberSinceDate(user?.createdAt);

    // Check if the authenticated user follows this profile
    const amIFollowing = authUser?.following.includes(user?._id);

    // Custom hook for updating the profile
    const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

    // Refetch the profile data when the username changes
    useEffect(() => {
        refetch();
    }, [username, refetch]);

    // Handle image selection for cover or profile images
    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "coverImg") setCoverImg(reader.result);
                if (state === "profileImg") setProfileImg(reader.result);
            };
            reader.readAsDataURL(file); // Convert file to a URL for preview
        }
    };

    return (
        <>
            <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
                {/* Show a loading skeleton or "User not found" if needed */}
                {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
                {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}

                {/* Profile content */}
                <div className='flex flex-col'>
                    {!isLoading && !isRefetching && user && (
                        <>
                            {/* Header with back button and user info */}
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <Link to='/'>
                                    <FaArrowLeft className='w-4 h-4' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{user?.fullName}</p>
                                    <span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
                                </div>
                            </div>

                            {/* Cover image */}
                            <div className='relative group/cover'>
                                <img
                                    src={coverImg || user?.coverImg || "/cover.png"}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                {/* Edit button for cover image */}
                                {isMyProfile && (
                                    <div
                                        className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                                        onClick={() => coverImgRef.current.click()}
                                    >
                                        <MdEdit className='w-5 h-5 text-white' />
                                    </div>
                                )}

                                {/* File inputs for images */}
                                <input
                                    type='file'
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />

                                {/* Profile image */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar'>
                                        <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
                                        {isMyProfile && (
                                            <div
                                                className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'
                                                onClick={() => profileImgRef.current.click()}
                                            >
                                                <MdEdit className='w-4 h-4 text-white' />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons for editing or following */}
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal authUser={authUser} />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={() => follow(user?._id)}
                                    >
                                        {isPending ? "Loading..." : amIFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={async () => {
                                            await updateProfile({ coverImg, profileImg }); // Update profile images
                                            setProfileImg(null);
                                            setCoverImg(null);
                                        }}
                                    >
                                        {isUpdatingProfile ? "Updating..." : "Update"}
                                    </button>
                                )}
                            </div>

                            {/* User information */}
                            <div className='flex flex-col gap-4 mt-14 px-4'>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{user?.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{user?.username}</span>
                                    <span className='text-sm my-1'>{user?.bio}</span>
                                </div>

                                {/* User links and membership date */}
                                <div className='flex gap-2 flex-wrap'>
                                    {user?.link && (
                                        <div className='flex gap-1 items-center'>
                                            <FaLink className='w-3 h-3 text-slate-500' />
                                            <a
                                                href={user?.link}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-sm text-blue-500 hover:underline'
                                            >
                                                {user?.link}
                                            </a>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>{memberSinceDate}</span>
                                    </div>
                                </div>

                                {/* Following and followers */}
                                <div className='flex gap-2'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.following.length}</span>
                                        <span className='text-slate-500 text-xs'>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.followers.length}</span>
                                        <span className='text-slate-500 text-xs'>Followers</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs for switching between Posts and Likes */}
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                {/* Tab for viewing posts */}
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("posts")}
                                >
                                    Posts
                                    {/* Highlight the active tab */}
                                    {feedType === "posts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                {/* Tab for viewing likes */}
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("likes")}
                                >
                                    Likes
                                    {/* Highlight the active tab */}
                                    {feedType === "likes" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Display posts or liked posts based on the selected tab */}
                    <Posts feedType={feedType} username={username} userId={user?._id} />
                </div>
            </div>
        </>
    );
};
export default ProfilePage;
