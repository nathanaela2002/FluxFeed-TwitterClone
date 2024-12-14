const LoadingSpinner = ({ size = "lg" }) => {
	const sizeClass = `loading-${size}`; // Generate CSS class based on the size 

	return <span className="loading loading-bars text-secondary"></span>; // Renders <span> element with loading spinner
};
export default LoadingSpinner;