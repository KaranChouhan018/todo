# Todo App Backend API

Custom JWT Authentication with NeonDB (PostgreSQL)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Edit `.env` file with your credentials:
```env
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Todo Routes (All Protected)
- `GET /api/todos` - Get all user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Health Check
- `GET /api/health` - Server health status

## 🔒 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Token stored in HTTP-only cookie
4. Protected routes verify token on each request
5. Token expires after 7 days (configurable)



## 🛡️ Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ User ownership validation
- ✅ SQL injection protection (parameterized queries)

## 📦 Dependencies
- `express` - Web framework
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `pg` - PostgreSQL client
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `cookie-parser` - Cookie parsing
