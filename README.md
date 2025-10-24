# GoFix - Service Provider Platform

A full-stack web application that connects users who need services with service providers who can fulfill those needs. Users can post service requests, and providers can bid on them.

## Features

### For Users:
- Register and login as a service requester
- Post service requests with images
- View and manage bids from service providers
- Select preferred providers
- Track request status

### For Service Providers:
- Register and login as a service provider
- Browse available service requests
- Place bids on jobs
- Track bid status
- View accepted work

## Tech Stack

### Backend:
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Multer** for file handling
- **bcryptjs** for password hashing

### Frontend:
- **React** with Vite
- **Material-UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

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
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
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

## Future Enhancements

- Real-time chat functionality
- Payment integration
- Rating and review system
- Push notifications
- Advanced search and filtering
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
