Collaborative Task Manager
A full-stack, real-time task management application built with modern web technologies.

🚀 Live Demo
Frontend: https://your-frontend.vercel.app

Backend API: https://your-backend.vercel.app

🛠️ Tech Stack
Frontend
Next.js 16 (App Router) with TypeScript

Tailwind CSS for styling

SWR for data fetching and caching

React Hook Form with Zod validation

Socket.io Client for real-time updates

Sonner for toast notifications

Backend
Node.js + Express with TypeScript

MongoDB with Prisma ORM

Socket.io for real-time communication

JWT authentication with HttpOnly cookies

bcryptjs for password hashing

Zod for input validation

🏗️ Architecture Overview
Backend Architecture
src/
├── modules/
│   ├── auth/           # Authentication logic
│   ├── task/           # Task CRUD operations
│   ├── user/           # User management
│   └── audit/          # Audit logging
├── middlewares/        # Auth & error handling
├── socket/             # Real-time communication
└── config/             # Database & app config

Copy
Design Patterns:

Service/Repository Pattern: Clear separation of business logic and data access

Controller-Service-Repository: MVC-like architecture

DTOs with Zod: Input validation and type safety

Frontend Architecture
src/
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
├── context/            # Auth & Socket contexts
├── hooks/              # Custom hooks (SWR)
├── lib/                # API client & utilities
└── types/              # TypeScript definitions

Copy
🔧 Local Development Setup
Prerequisites
Node.js 18+

MongoDB (local or Atlas)

Git

Backend Setup
cd backend
npm install
cp .env.example .env
# Configure your MongoDB URL and JWT secret in .env
npm run dev

Copy
Frontend Setup
cd frontend
npm install
cp .env.local.example .env.local
# Configure API URLs in .env.local
npm run dev

Copy
bash
Environment Variables
Backend (.env):

DATABASE_URL=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=5000

Copy
Frontend (.env.local):

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

Copy
📡 API Documentation
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/auth/logout - User logout

Tasks
GET /api/tasks - Get tasks with filtering/sorting

GET /api/tasks/dashboard - Get dashboard data

POST /api/tasks - Create new task

PUT /api/tasks/:id - Update task

DELETE /api/tasks/:id - Delete task (creator only)

Users
GET /api/users/me - Get current user profile

PUT /api/users/me - Update user profile

GET /api/users - Get all users (for assignment)

Request/Response Examples
Create Task:

POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "user_id_here"
}

Copy
json
🔄 Real-Time Features (Socket.io)
Implementation
Connection Management: Users join personal rooms on connect

Event Broadcasting: Targeted notifications to specific users

Deduplication: Prevents spam notifications for rapid changes

Socket Events
taskCreated - New task created

taskUpdated - Task modified (status, priority, assignment)

taskAssigned - Task assigned to user

taskDeleted - Task removed

Notification System
Smart Filtering: Users don't receive notifications for their own changes

Deduplication: One notification per task change session

Persistent Storage: In-app notification history

🗄️ Database Choice: MongoDB
Why MongoDB:

Flexible Schema: Easy to iterate on task attributes

JSON-Native: Seamless integration with Node.js/TypeScript

Horizontal Scaling: Better for real-time collaborative features

Rich Queries: Complex filtering and sorting capabilities

Atlas Integration: Excellent cloud hosting with Vercel

Data Models:

// User Model
{
  id: string
  name: string
  email: string (unique, lowercase)
  password: string (hashed)
  createdAt: DateTime
}

// Task Model
{
  id: string
  title: string (max 100 chars)
  description: string
  dueDate: DateTime
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "To Do" | "In Progress" | "Review" | "Completed"
  creatorId: string
  assignedToId?: string
  createdAt: DateTime
}

Copy
typescript
🔐 Security Implementation
Password Hashing: bcryptjs with salt rounds

JWT Tokens: HttpOnly cookies for secure session management

Input Validation: Zod schemas on all endpoints

CORS Configuration: Restricted origins

Authorization: Role-based access (creator-only deletion)

✨ Key Features
Core Functionality
✅ User authentication & authorization

✅ Complete CRUD operations for tasks

✅ Real-time collaboration with Socket.io

✅ Dashboard with personal task views

✅ Advanced filtering & sorting

✅ Responsive design (mobile-first)

Advanced Features
✅ Audit Logging: Track who updated tasks and when

✅ Optimistic Updates: Instant UI feedback with SWR

✅ Smart Notifications: Deduplication and user filtering

✅ Loading States: Skeleton loaders throughout

✅ Error Handling: Comprehensive error boundaries

🧪 Testing
cd backend
npm test

Copy
bash
Test Coverage:

Task creation validation

Socket.io assignment logic

Authentication middleware

🚀 Deployment
Vercel Deployment
Backend: Deployed as Vercel Functions

Frontend: Static site with SSR

Database: MongoDB Atlas (free tier)

Build Commands
{
  "backend": "npm run build && npm start",
  "frontend": "npm run build && npm start"
}

Copy
json
🔄 Trade-offs & Assumptions
Technical Decisions
SWR over React Query: Simpler setup, excellent caching

MongoDB over PostgreSQL: Better for rapid prototyping and real-time features

Prisma: Type-safe database access with excellent MongoDB support

Socket.io: Industry standard for real-time features

Assumptions
Users have modern browsers (ES2017+)

Reasonable task volumes (< 10k tasks per user)

English-only interface

Single timezone support

Performance Optimizations
SWR Caching: Reduces API calls

Socket Room Management: Targeted notifications

Optimistic Updates: Instant UI feedback

Lazy Loading: Components loaded on demand

📝 Development Notes
Code Quality
TypeScript: Strict mode enabled

ESLint: Next.js recommended rules

Prettier: Consistent code formatting

Husky: Pre-commit hooks

Monitoring & Logging
Console-based logging in development

Error tracking for production deployment

Audit trail for task modifications

Author: [Your Name]
Repository: [GitHub Link]
Deployment: Vercel + MongoDB Atlas