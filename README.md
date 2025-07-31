# Nongtalk Backend

This is the backend for the Nongtalk application, a chat platform built with Node.js, Express, TypeScript, Prisma, and Socket.IO. It provides APIs for user registration, authentication, friend management, messaging, and profile management.

## Tech Stack
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building RESTful APIs.
- **TypeScript**: Adds static types to JavaScript for better scalability.
- **Prisma**: ORM for database management.
- **Socket.IO**: Enables real-time bidirectional communication for chat features.

## API Endpoints

### Authentication
#### Register
```http
POST /auth/register
Host: localhost:5000
Content-Type: application/json

{
  "email": "yassir@example.com",
  "username": "yassir",
  "password": "12345678"
}
```

#### Login
```http
POST /auth/login
Host: localhost:5000
Content-Type: application/json

{
  "email": "guest@example.com",
  "password": "12345678"
}
```

### Friends
#### Add Friend
```http
POST /friends
Host: localhost:5000
Authorization: Bearer <Token>
Content-Type: application/json

{
  "friendCode": "USR834028"
}
```

#### Get All Friends
```http
GET /friends
Host: localhost:5000
Authorization: Bearer <Token>
```

### Profile
#### Get User Profile
```http
GET /profile
Host: localhost:5000
Authorization: Bearer <Token>
```

#### Update Profile
```http
PATCH /profile
Host: localhost:5000
Authorization: Bearer <Token>
Content-Type: application/json

{
  "username": "faisal"
}
```

### Messaging
#### Load Chat History
```http
POST /message
Host: localhost:5000
Authorization: Bearer <Token>
Content-Type: application/json

{
  "friendCode": "USR834028"
}
```

## How to Clone
1. Clone the repository:
   ```bash
   git clone https://github.com/VsalCode/nongtalk-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nongtalk-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add necessary configurations (e.g., database URL, JWT secret).
   ```env
   DATABASE_URL="your-database-url"
   JWT_SECRET="your-jwt-secret"
   PORT=5000
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

## How to Contribute
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them with a descriptive message:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request on the main repository.
6. Ensure your code follows the project's coding standards and passes any tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.