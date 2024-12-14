import { Navigate, Route, Routes } from "react-router-dom"; // Import React Router components for navigation

import HomePage from "./pages/home/HomePage"; // Home page component
import SignUpPage from "./pages/auth/signup/SignUpPage"; // Sign-up page component
import LoginPage from "./pages/auth/login/LoginPage"; // Login page component
import Sidebar from "./components/common/Sidebar"; // Sidebar component for navigation
import RightPanel from "./components/common/RightPanel"; // Right panel with additional content
import NotificationPage from "./pages/notification/NotificationPage"; // Notifications page component
import ProfilePage from "./pages/profile/ProfilePage"; // User profile page component
import { Toaster } from "react-hot-toast"; // For showing toast notifications
import { useQuery } from "@tanstack/react-query"; // Query hook for fetching data
import LoadingSpinner from "./components/common/LoadingSpinner"; // Loading spinner for loading states

function App() {
  // Fetch authenticated user data
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"], // Unique key for the authUser query
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me"); // API call to fetch authenticated user
        const data = await res.json();
        if (data.error) return null; // If there's an error in the data, return null
        if (!res.ok) {
          // Handle non-OK HTTP responses
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data); // Log user data for debugging
        return data;
      } catch (error) {
        throw new Error(error); // Throw error if API call fails
      }
    },
    retry: false, // Do not retry the query if it fails
  });

  // Show a loading spinner while fetching user data
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' /> {/* Show large spinner */}
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {/* Show sidebar if user is authenticated */}
      {authUser && <Sidebar />}

      {/* Define application routes */}
      <Routes>
        {/* Home page route: accessible only when authenticated */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />

        {/* Login page route: accessible only when not authenticated */}
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />

        {/* Sign-up page route: accessible only when not authenticated */}
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />

        {/* Notifications page route: accessible only when authenticated */}
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />

        {/* Profile page route: accessible only when authenticated */}
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      {/* Show the right panel if user is authenticated */}
      {authUser && <RightPanel />}

      {/* Toast notifications for the app */}
      <Toaster />
    </div>
  );
}

export default App; // Export the App component
