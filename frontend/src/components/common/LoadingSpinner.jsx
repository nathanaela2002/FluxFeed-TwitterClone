const LoadingSpinner = ({ size = "lg" }) => {
	const sizeClass = `loading-${size}`;

	return <span className="loading loading-bars text-secondary"></span>;
};
export default LoadingSpinner;