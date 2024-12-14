import { StrictMode } from 'react'; // Ensures strict mode checks for React components
import { createRoot } from 'react-dom/client'; // For rendering the React application
import App from "./App.jsx"; // Main App component
import "./index.css"; // Global CSS styles
import { BrowserRouter } from "react-router-dom"; // For enabling routing in the application
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // For managing server state with Tan Stack Query

// Create a QueryClient instance for Tan Stack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching data when the window regains focus
    },
  },
});

// Render the React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the application with BrowserRouter for routing */}
    <BrowserRouter>
      {/* Provide the QueryClient to Tan Stack Query */}
      <QueryClientProvider client={queryClient}>
        {/* Main App component */}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
