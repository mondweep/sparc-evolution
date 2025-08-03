
# Task Management API

A comprehensive task management system with user authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
All endpoints except user registration require authentication.
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Users

#### Create User (Register)
```
POST /api/v1/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Get All Users
```
GET /api/v1/users
Authorization: Bearer <token>
```

#### Get User by ID
```
GET /api/v1/users/:id
Authorization: Bearer <token>
```

### Tasks

#### Create Task
```
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API development",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Get All Tasks
```
GET /api/v1/tasks
Authorization: Bearer <token>
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a message:
```json
{
  "error": "Description of the error"
}
```

## Rate Limiting

The API includes rate limiting:
- 100 requests per 15 minutes per IP address

## Development

### Running Tests
```bash
npm test
```

### Environment Variables
Create a `.env` file with:
```
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=database.sqlite
NODE_ENV=development
```
