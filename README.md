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
![Home Page](https://cdn.discordapp.com/attachments/796594711665180684/1295568445857071186/image.png?ex=670f1fa3&is=670dce23&hm=bc098cd991fc8e4a29d7d52fff4e2389e0f37181cbed3337a094251f5e01db2c&)

Sign Up Page
![HSign Up Page](https://cdn.discordapp.com/attachments/796594711665180684/1295569477815107708/image.png?ex=670f209a&is=670dcf1a&hm=491e0288b2b532020addd37f84727697e37b224c777d68c032c09a26548ad794&)

Log In Page
![Log In Page](https://cdn.discordapp.com/attachments/796594711665180684/1295569362014699594/image.png?ex=670f207e&is=670dcefe&hm=a7c2d5fd92ca4c19a54cc37aba9b2c855c58061f044e3076185ed34b4eeafc72&)

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

