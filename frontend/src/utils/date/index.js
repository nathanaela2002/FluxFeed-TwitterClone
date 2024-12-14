// Format the post's creation date into a readable string
export const formatPostDate = (createdAt) => {
    // Get the current date and the post's creation date
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    // Calculate the time difference in seconds, minutes, hours, and days
    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    // Return the formatted date based on how much time has passed
    if (timeDifferenceInDays > 1) {
        // For posts older than 1 day, return "Month Day" format
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (timeDifferenceInDays === 1) {
        // For posts exactly 1 day old, return "1d"
        return "1d";
    } else if (timeDifferenceInHours >= 1) {
        // For posts older than 1 hour, return hours with "h"
        return `${timeDifferenceInHours}h`;
    } else if (timeDifferenceInMinutes >= 1) {
        // For posts older than 1 minute, return minutes with "m"
        return `${timeDifferenceInMinutes}m`;
    } else {
        // For posts less than 1 minute old, return "Just now"
        return "Just now";
    }
};

// Format the date when a user joined into Joined Month Year
export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt); // Convert the input date string to a Date object
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()]; // Get the month name
    const year = date.getFullYear(); // Get the year
    return `Joined ${month} ${year}`; // Return the formatted string
};