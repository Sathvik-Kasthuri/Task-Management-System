Task Management System

A full-stack task management application built with the MERN stack.
Users can create an account, sign in securely, and manage their personal
tasks with search, filtering, sorting, pagination, analytics, and CRUD
operations.

Live Demo

Frontend: https://task-management-app-mern.netlify.app/

Backend: https://task-management-backend-ixdu.onrender.com/

GitHub Repository

https://github.com/Sathvik-Kasthuri/Task-Management-System

Features

Authentication

User signup

User signin

JWT-based authentication

Protected task APIs

User-specific task access

Task Management

Create tasks

View tasks

Update tasks

Delete tasks

Task status management

Task priority management

Due dates

Search, Filter & Sort

Search tasks by title

Filter by status

Filter by priority

Sort by newest first

Sort by due date

Sort by priority

Pagination

Tasks are displayed using pagination to make the task list easier to
manage.

Analytics

Total tasks

Completed tasks

Pending tasks

Completion percentage

UI

Responsive dashboard

Responsive authentication pages

Task creation and editing forms

Search and filter controls

Analytics section

Tech Stack

Frontend

React.js

Vite

React Router DOM

Axios

CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Deployment

Frontend: Netlify

Backend: Render

Database: MongoDB Atlas

Development Tools

Git

GitHub

Postman

VS Code

Project Structure

Task-Management-System/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md

Setup Instructions

1. Clone the repository

git clone https://github.com/Sathvik-Kasthuri/Task-Management-System.git
cd Task-Management-System

2. Backend setup

cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend:

npm run dev

The backend will run locally on:

http://localhost:5000

3. Frontend setup

Open another terminal:

cd client
npm install
npm run dev

The frontend will run on the Vite development server, usually:

http://localhost:5173

API Endpoints

Authentication

Method   Endpoint             Description

POST     /api/auth/signup   Register a new user
POST     /api/auth/signin   Sign in an existing user

Tasks

Method   Endpoint           Description

POST     /api/tasks       Create a task
GET      /api/tasks       Get the logged-in user's tasks
PUT      /api/tasks/:id   Update a task
DELETE   /api/tasks/:id   Delete a task

Task Query Parameters

The task GET endpoint supports:

/api/tasks?search=workout
/api/tasks?status=pending
/api/tasks?priority=high
/api/tasks?sort=dueDate
/api/tasks?sort=priority

Multiple filters can also be combined.

Task Fields

Each task contains:

Field         Type       Description

title         String     Task title
description   String     Task description
status        String     pending, in-progress, or completed
priority      String     low, medium, or high
dueDate       Date       Task due date
user          ObjectId   User who owns the task

Authentication Flow

User creates an account through Signup.

User signs in through Signin.

Backend validates the credentials.

A JWT token is generated.

The frontend stores the authentication information.

Protected task requests include the authentication token.

The backend identifies the logged-in user and only returns that
user's tasks.

Design Decisions

JWT Authentication

JWT was used to protect task-related APIs and identify the logged-in
user.

User-specific Tasks

Every task stores the associated user's ID. Task queries, updates, and
deletes are restricted to the authenticated user's tasks.

REST API

The backend follows REST-style endpoints for authentication and task
CRUD operations.

Separate Frontend and Backend

The React frontend and Express backend are maintained separately and
deployed independently. This makes the application easier to develop,
test, and deploy.

MongoDB

MongoDB was selected for storing users and tasks because it integrates
naturally with the Node.js/Mongoose backend and provides a flexible
document-based structure.

Deployment

Frontend

The React/Vite frontend is deployed on Netlify.

Build configuration:

Base directory: client
Build command: npm run build
Publish directory: dist

Backend

The Express backend is deployed on Render.

Database

MongoDB Atlas is used as the production database.

Security

Passwords are hashed before storing them.

JWT authentication is used for protected APIs.

Users can only access their own tasks.

Environment variables are used for sensitive backend configuration.

.env and node_modules are excluded from Git using .gitignore.

Future Enhancements

Task reminders and email notifications

Dashboard charts

Drag-and-drop task management

Dark mode

User profile management

Role-based access control

More advanced task statistics

Author

Sathvik Kasthuri

B.Tech - Artificial Intelligence and Data Science

GitHub: https://github.com/Sathvik-Kasthuri

Submission

This project includes:

GitHub repository with frontend and backend

README documentation

Live deployed frontend

Live deployed backend

Authentication

Task CRUD operations

Search and filtering

Pagination

Analytics
