# Flux Feed - Twitter Clone

Flux Feed is a modern Twitter clone application that offers a full-featured social media experience. Developed with the MERN stack, it enables real-time interactions, secure authentication, and a clean, responsive interface with Tailwind CSS and DaisyUI. This project highlights my full-stack development skills, with an emphasis on performance, scalability, and intuitive design.

## Features

## 1. Real-Time User Interactions
Users on Flux Feed experience real-time interactions, making the app dynamic and engaging.

- Posting and Liking: Users can post new tweets and like others' tweets, with updates happening in real-time.
- Retweeting and Commenting: Users can retweet and comment on posts instantly, enabling a truly interactive experience.
- Notification System: Real-time notifications for new followers, likes, retweets, and comments without refreshing the page.

## 2. Secure User Authentication
Flux Feed uses secure authentication methods to ensure user data privacy and session security.

- JWT Authentication: Users sign in with JSON Web Tokens, which keep sessions secure and prevent unauthorized access.
- Bcrypt Password Hashing: User passwords are encrypted with bcrypt, providing an extra layer of security.

## 3. Modern, Responsive Interface
Flux Feed is designed with a clean, mobile-friendly interface for a great user experience on any device.

- Tailwind CSS & DaisyUI: The frontend is styled with Tailwind CSS and DaisyUI, making use of utility classes and modern UI components.
- Responsive Design: With mobile-first principles, Flux Feed adapts seamlessly to different screen sizes.

Home Page
![Home Page](https://cdn.discordapp.com/attachments/796594711665180684/1295543891616989214/Frontend.png?ex=670f08c5&is=670db745&hm=c487cb65d532b0cd112df79743be15575cc8ad67258d3b7ffcdfe896af9fe32c&)

Sign Up Page
![HSign Up Page](https://cdn.discordapp.com/attachments/796594711665180684/1295545368930549782/image.png?ex=670f0a26&is=670db8a6&hm=35a2e4f36f68836f90bcf0fae0061f009ac7e2baef4e5e6836439ee29573014b&)

Log In Page
![Log In Page](https://cdn.discordapp.com/attachments/796594711665180684/1295545429030735872/image.png?ex=670f0a34&is=670db8b4&hm=0b8bb36185a59b77302f36ec9762fd4f24e41baa5643dbce7e89716ce6ab5aa2&)

## 4. Real-Time Data with Socket.io
Flux Feed uses Socket.io to enable real-time updates across the platform.

- Live Feed: The home feed updates instantly as users interact with the app.
- Instant Notifications: New notifications are pushed to users in real-time, enhancing engagement.
- Real-Time Messaging: A direct messaging feature will be added in future updates using Socket.io.

## 5. Scalable and Modular Codebase
Flux Feed is built with scalability and maintainability in mind, ensuring efficient development and easy expansion.

- Backend: Built with Node.js and Express, Flux Feed handles RESTful API requests and interacts with MongoDB.
- Frontend: Using React and Redux for state management, the frontend is optimized for performance and user experience.
- Environment Management: The app configuration is centralized with a `.env` file, allowing easy switching between development and production environments.

## Project Design and Technologies

- Frontend: React, Tailwind CSS, DaisyUI, Redux
- Backend: Node.js, Express
- Database: MongoDB
- Real-Time Communication: Socket.io
- Authentication: JWT with bcrypt for password hashing

## Installation

1. Clone the Repository:
   ```bash
   git clone https://github.com/yourusername/flux-feed-twitter-clone.git
   cd flux-feed-twitter-clone
2. Backend Set Up:
   ```bash
   cd backend
   npm install
4. Run Backend:
   ```bash
   cd backend
   npm run start
6. Front Set Up:
   ```bash
   cd ../frontend
   npm install
8. Run frontend:
   ```bash
   cd frontend
   npm run dev

