# Actowiz Bug Tracking System

## Project Structure

- `backend/` - Node.js/Express API server
- `frontend/` - React/TypeScript

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB (local)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd actowiz
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/actowiz
JWT_SECRET=your_jwt_secret_key_here
```

- `PORT`: Port for the backend server (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Running the Project

1. Start the backend server:
   ```bash
   cd backend
   nodemon index.js
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## NOTE
- Postman collection for API testing is available in the `postman_collection.json` file in the root directory. Import it into Postman to test the API endpoints.

- Database schema file added in the backend directory for reference.