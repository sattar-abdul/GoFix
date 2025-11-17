# GoFix - Service Provider Platform

A full-stack web application that connects users who need services with service providers who can fulfill those needs. Users can post service requests, and providers can bid on them.

## Features

### For Users:
- Register and login as a service requester
- Post service requests with images
- View and manage bids from service providers
- Select preferred providers
- Track request status
- Get notified for new bids on your task

### For Service Providers:
- Register and login as a service provider
- Browse available service requests
- Place bids on jobs
- Track bid status
- View accepted work
- Get notified for acceptance of bid

## Tech Stack

### Backend:
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Multer** for file handling
- **bcryptjs** for password hashing
- **nodemailer** for email notifications

### Frontend:
- **React** with Vite
- **Material-UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Open Stree Map** for Visual Bidings
- **recharts** for user and provider analytics (Graphs)

## Project Structure

```
GoFix/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bidController.js
│   │   ├── chatController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Chat.js
│   │   ├── ServiceProvider.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bidRoutes.js
│   │   ├── chatRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
|
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
|   │   │   └── task.js
|   |   |
│   │   ├── assets/
|   |   |
│   │   ├── components/
|   │   │   ├── BidsDialog.jsx
|   │   │   ├── Navbar.jsx
|   │   │   ├── ProtectedProviderRoute.jsx
|   │   │   ├── ProtectedUserRoute.jsx
|   │   │   ├── RatingDialog.jsx
|   │   │   └── TaskCard.jsx
|   |   |
│   │   ├── contexts/
|   │   │   ├── AuthContext.jsx
|   │   │   ├── ProviderAuthContext.jsx
|   │   │   └── UserAuthContext.jsx
|   |   |
│   │   ├── layout/
|   │   │   ├── ProviderLayout.jsx
|   │   │   └── UserLayout.jsx
|   |   |
│   │   ├── pages/
|   │   │   ├── provider/
|   |   │   │   ├── AcceptedWork.jsx
|   |   │   │   ├── BrowserJobs.jsx
|   |   │   │   ├── MyBids.jsx
|   |   │   │   └── ProviderDashboard.jsx
|   |   |   |
|   │   │   ├── user/
|   |   │   │   ├── PostServiceRequest.jsx
|   |   │   │   ├── Requests.jsx
|   |   │   │   └── Dashboard.jsx
|   |   |   |
|   │   │   ├── AuthPage.js
|   │   │   ├── ChatPage.js
|   │   │   ├── ChatPage.jsx
|   │   │   ├── Login.jsx
|   │   │   ├── NotFound.jsx
|   │   │   ├── Register.jsx
|   │   │   └── TaskPost.js
|   |   |
│   │   ├── utils/
|   │   │   ├── api.js
|   │   │   └── ProtectedRoute.jsx
|   |   |
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── main.jsx
│   │   ├── theme.js
│   │   ├── .gitignore
│   │   └── index.html
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/gofix
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
EMAIL_FROM="GoFix <yourmail@gmail.com>"
EMAIL_PASS=your_email_app_pass
EMAIL_SERVICE=gmail
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all open tasks
- `GET /api/tasks/my-tasks` - Get user's own tasks
- `POST /api/tasks` - Create a new task

### Bids
- `POST /api/bids/place` - Place a bid on a task
- `PUT /api/bids/select` - Select a bid

### Chat
- `GET /api/chat/:taskId` - Get chat for a task
- `POST /api/chat` - Send a message

## Usage

1. **Register**: Create an account as either a user or service provider
2. **Login**: Access your dashboard based on your role
3. **Users**: Post service requests and manage bids
4. **Providers**: Browse jobs and place bids
5. **Communication**: Chat with selected providers

## Key Features Implemented

✅ User authentication and authorization
✅ Role-based access control (User/Provider)
✅ Task creation and management
✅ Bidding system
✅ Image upload with Cloudinary
✅ Responsive Material-UI design
✅ Protected routes
✅ Real-time data updates
✅ Error handling and validation
✅ Email Notifications

## Future Enhancements

- Payment integration
- Push notifications
- Advanced search and filtering
- Mobile app development


Project Analysis: GoFix - Service Provider Platform

Overview
GoFix is a full-stack web application that connects users needing services with service providers. It features user registration/login, task posting with image uploads, bidding system, provider selection, task completion, rating system, and real-time chat. The platform supports role-based access for users and providers.

Tech Stack

Backend: Node.js with Express.js, MongoDB with Mongoose, JWT authentication, Cloudinary for image uploads, Multer for file handling, bcryptjs for password hashing, nodemailer for email notifications, Socket.IO for real-time features.

Frontend: React with Vite, Material-UI for components, React Router for navigation, Axios for API calls, Context API for state management, Socket.IO client for real-time communication.
Project Structure

Backend (/backend)
Entry Point: server.js - Sets up Express app, connects to DB, configures CORS, JSON parsing, and mounts routes for auth, tasks, bids, and chat.

Models:
User.js: Handles user data with roles (user/provider), includes rating fields for providers.
Task.js: Core model with bid schema, supports task lifecycle (open/assigned/completed), ratings.
ServiceProvider.js: Additional provider details like skills, availability.
Chat.js: Message and chat schemas for communication.

Controllers:
authController.js: Registration and login.
taskController.js: Task CRUD, bidding, completion, rating with email notifications.
bidController.js: Bid placement and selection.
chatController.js: Chat retrieval and message saving.
Routes: Modular routing for auth, tasks, bids, chat.
Middleware: Auth middleware, error handling, file upload.
Utils: Email sending utility.
Config: DB connection, Cloudinary setup.

Frontend (/Frontend)
Entry Points: main.jsx renders App, App.jsx sets up routing with ThemeProvider, auth contexts, and protected routes.

Components:
TaskCard.jsx: Displays task details, bids, status, with action buttons.
BidsDialog.jsx, RatingDialog.jsx: Modals for bid viewing and provider rating.
Header.jsx, Footer.jsx: Navigation and footer.
LandingPage.jsx: Public landing page.
Protected route components for user/provider access.

Pages:
User: Dashboard, PostServiceRequest, Requests, ChatPage.
Provider: ProviderDashboard, BrowseJobs, MyBids, AcceptedWork, ChatPage.
Auth: Login, Register.
Contexts: Separate auth contexts for users and providers, managing login/logout with localStorage.
Utils: API utility for Axios setup.
Assets: Images, theme configuration.
Key Features Implemented
Authentication: JWT-based with role-based routing.
Task Management: Posting with image upload, status tracking.
Bidding System: Providers bid on tasks, users select providers.
Communication: Real-time chat between users and selected providers.
Rating System: Users rate providers after task completion, updating averages.
Email Notifications: Automated emails for task posting, bid acceptance, completion, ratings.
Responsive UI: Material-UI components with custom theme.
Protected Routes: Ensures access based on user role.
Architecture Insights
MVC Pattern: Backend follows MVC with models, controllers, routes.
RESTful APIs: Standard endpoints for CRUD operations.
State Management: Context API for auth state, no global state library.
Real-time: Socket.IO for chat, though not fully integrated in read files.
Security: JWT, bcrypt, CORS, input validation.
Scalability: Modular structure, separate concerns.
Potential Improvements
Add payment integration.
Implement push notifications.
Enhance search/filtering.
Mobile app development.
Advanced provider profiles.
The project is well-structured, follows best practices, and implements core functionalities effectively.