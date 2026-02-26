# PrimeTrade - Scalable REST API & Frontend

A full-stack application demonstrating a scalable REST API and a robust frontend UI.

## Features Completed
### Backend (Node.js, Express, MongoDB)
- **Authentication**: User registration and login with bcrypt password hashing and JWT.
- **Role-Based Access**: Distinguishes between `user` and `admin` roles.
- **CRUD APIs**: Full Create, Read, Update, Delete for a secondary `Product` entity.
- **Security**: Helmet, CORS, parameterized queries via Mongoose (NoSQL injection prevention).
- **Documentation**: Integrated Swagger UI available at `/api-docs`.
- **Validation**: Mongoose schema validation & express error handling.

### Frontend (React, Vite, Tailwind CSS v4)
- **Modern UI**: Clean and minimal interface built with Tailwind CSS.
- **Authentication Context**: React Context to handle login/logout states.
- **Dashboard**: Protected route where users can manage their Products.
- **Error Handling**: Graceful error and success messages displayed to the user.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on default port `27017` or update the `.env` file)

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the frontend app in your browser (typically `http://localhost:5173`).

## Scalability Notes & Future Improvements
To scale this application for production traffic, the following concepts can be applied:

1. **Microservices Architecture**: If the business logic grows, we can split this monolithic Express app into microservices (e.g., Auth Service, Product Service, Notification Service) communicating via gRPC or message queues like RabbitMQ/Kafka.
2. **Caching**: Integrate Redis to cache frequent read-heavy requests (like retrieving all public products). This drastically reduces MongoDB load.
3. **Database Scaling**: Implement MongoDB replica sets for high availability and sharding for horizontal scaling of the dataset.
4. **Load Balancing**: Use Nginx or AWS Application Load Balancer (ALB) to distribute incoming traffic across multiple instances of the Node.js backend.
5. **Docker & Orchestration**: Containerize the frontend, backend, and database using Docker, and deploy a cluster using Kubernetes or AWS ECS for automated scaling and self-healing.
6. **Rate Limiting**: Add an API Gateway (like Kong or AWS API Gateway) or `express-rate-limit` to prevent DDoS attacks and abusive scraping.

## Evaluation Criteria Addressed
- **API design**: RESTful endpoints (`/api/v1/auth`, `/api/v1/products`), appropriate status codes (200, 201, 400, 401, 403, 404, 500), grouped routing logic.
- **Database schema design**: Well-structured Mongoose schemas with references (`Product` belongs to `User`).
- **Security practices**: JWT handling, passwords hashed before saving to DB, unauthorized actions blocked.
- **Functional frontend**: React context manages state smoothly. Pages redirect properly based on authentication state.
- **Scalability**: Documented scalable architecture pathways above.

## Scalability Notes & Future Improvements To scale this application for production traffic, the following concepts can be applied:

-**Microservices Architecture:** If the business logic grows, we can split this monolithic Express app into microservices (e.g., Auth Service, Product Service, Notification Service) communicating via gRPC or message queues like RabbitMQ/Kafka.

-**Caching:** Integrate Redis to cache frequent read-heavy requests (like retrieving all public products). This drastically reduces MongoDB load.

-**Database Scaling:** Implement MongoDB replica sets for high availability and sharding for horizontal scaling of the dataset.

-**Load Balancing:** Use Nginx or AWS Application Load Balancer (ALB) to distribute incoming traffic across multiple instances of the Node.js backend.

-**Docker & Orchestration:** Containerize the frontend, backend, and database using Docker, and deploy a cluster using Kubernetes or AWS ECS for automated scaling and self-healing.

-**Rate Limiting:** Add an API Gateway (like Kong or AWS API Gateway) or express-rate-limit to prevent DDoS attacks and abusive scraping.

## Swagger 

To read the api-docs go to `https:http://localhost:5000/api-docs`
