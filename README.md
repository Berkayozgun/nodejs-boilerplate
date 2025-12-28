## Secure Node.js API Boilerplate

**A production-ready Node.js API boilerplate designed with a "Security-First" philosophy, ensuring data integrity and robust protection against common web vulnerabilities from the ground up.**

## Table of Contents

*   [Project Title & Tagline](#project-title--tagline)
*   [Folder Structure](#folder-structure)
*   [Core Technical Features](#core-technical-features)

Data Sanitization

*   [Security Headers & Protection](#security-headers--protection)
*   [Authentication & RBAC](#authentication--rbac)
*   [IDOR Protection](#idor-protection)
*   [Observability](#observability)
*   [API Documentation](#api-documentation)
*   [Installation & Setup](#installation--setup)
*   [Engineering Vision](#engineering-vision)
*   [Security Considerations (Interview Ready)](#security-considerations-interview-ready)

## Folder Structure

Our project follows a clean architecture pattern, promoting separation of concerns and maintainability:

```plaintext
.env
.env.example
package.json
server.js
└── src/
    ├── config/
    │   ├── db.js
    │   └── swagger.js
    ├── controllers/
    │   ├── authController.js
    │   └── noteController.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── requestLogger.js
    ├── models/
    │   ├── Note.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   └── notes.js
    └── utils/
        └── logger.js
```

*   `**src/config**`: Configuration files for database, Swagger, etc.
*   `**src/controllers**`: Contains the business logic for handling requests and interacting with models.
*   `**src/middlewares**`: Houses Express middleware functions for authentication, error handling, logging, and security.
*   `**src/models**`: Defines Mongoose schemas for MongoDB, representing data structures.
*   `**src/routes**`: Defines API endpoints and links them to corresponding controller functions.
*   `**src/utils**`: Utility functions, such as the Winston logger.
*   `**server.js**`: The main entry point of the application, responsible for starting the server and connecting to the database.
*   `**.env**`: Environment variables for sensitive data (not committed to VCS).

## Core Technical Features

### Data Sanitization

Protects the API from common injection attacks:

*   **NoSQL Injection (**`**express-mongo-sanitize**`**)**: Prevents malicious queries from being executed by sanitizing user-supplied data, removing any `$` or `.` characters that could manipulate MongoDB queries.
*   **Cross-Site Scripting (XSS) (**`**xss-clean**`**)**: Sanitizes user input coming from `req.body`, `req.query`, and `req.params` to prevent XSS attacks by neutralizing potentially harmful scripts.

### Security Headers & Protection

Enhances the API's overall security posture:

*   **HTTP Headers (**`**helmet**`**)**: Sets various HTTP headers to secure the application against well-known web vulnerabilities (e.g., XSS, clickjacking).
*   **HTTP Parameter Pollution (HPP) (**`**hpp**`**)**: Protects against HTTP Parameter Pollution attacks by ensuring that all incoming request parameters are arrays, preventing attackers from injecting duplicate parameters.
*   **Rate Limiting (**`**express-rate-limit**`**)**: Implements a rate-limiting mechanism to protect against DDoS and brute-force attacks by restricting the number of requests a user can make within a specified time window.

### Authentication & RBAC

Robust user authentication and authorization:

*   **JWT-based Authentication (**`**jsonwebtoken**`**,** `**bcryptjs**`**)**: Users authenticate by receiving a JSON Web Token (JWT) after successful login. Passwords are securely hashed using `bcryptjs` before being stored in the database.
*   **Role-Based Access Control (RBAC)**: The system implements RBAC with `user`, `publisher`, and `admin` roles. The `authorize` middleware in `src/middlewares/authMiddleware.js` restricts access to specific routes based on the authenticated user's role.

### IDOR Protection

Securing access to user-specific resources:

*   **Ownership Validation**: The `noteController.js` meticulously implements resource-level ownership validation. When a user attempts to `GET`, `PUT`, or `DELETE` a specific note (`/api/v1/notes/:id`), the API strictly verifies that the authenticated user (`req.user.id`) is indeed the owner of that note (`note.user.toString()`). If ownership does not match, a `403 Forbidden` error is returned, preventing Insecure Direct Object Reference (IDOR) attacks and ensuring users can only interact with their own data.

### Observability

Comprehensive logging for monitoring and security auditing:

*   **Winston Logging**: A robust logging system utilizing `winston` is configured to provide detailed insights into application behavior.
    *   `**logs/access.log**`: Records all incoming HTTP requests.
    *   `**logs/error.log**`: Captures all server-side errors, particularly `500 Internal Server Error` events, with stack traces (in development).
    *   `**logs/security.log**`: Specifically logs security-related events, such as `403 Forbidden` access attempts. These logs include the attempting user's ID, email, target URL, and IP address for forensic analysis.

### API Documentation

Interactive and up-to-date API reference:

*   **Swagger (OpenAPI 3.0)**: The API is fully documented using `swagger-jsdoc` and `swagger-ui-express`. All authentication and notes endpoints are described with their request/response schemas, parameters, and security requirements.
*   **Access**: The interactive API documentation is accessible at the `/api-docs` endpoint (e.g., `http://localhost:5000/api-docs`). It includes an "Authorize" button to easily test authenticated endpoints using a Bearer Token (JWT).

## Installation & Setup

Follow these steps to get your project up and running:

**Clone the repository:**

**Create a** `**.env**` **file:**  
Create a file named `.env` in the root directory of the project and add the following environment variables:

_Make sure to replace_ `_your_super_secret_jwt_key_` _with a strong, unique secret key._

**Install dependencies:**

**Run the development server:**

The API will be accessible at `http://localhost:5000/api/v1` and Swagger documentation at `http://localhost:5000/api-docs`.

## Engineering Vision

This boilerplate distinguishes itself from standard Express setups by embedding a "Security-First" mindset into its core design. Rather than bolting on security features as an afterthought, this project prioritizes data integrity, user privacy, and system resilience by design. Every architectural decision, from robust input validation and granular access controls to comprehensive logging and secure deployment practices, aims to mitigate common attack vectors and provide a solid foundation for enterprise-grade applications. It encourages developers to build secure applications from day one, fostering a culture of defensive programming.

## Security Considerations (Interview Ready)

*   **Principle of Least Privilege (PoLP)**: Users and system components are granted only the minimum necessary permissions to perform their intended functions. This is evident in our RBAC implementation where `user` roles have limited access, while `admin` roles have elevated but strictly controlled privileges (e.g., `getAdminAllNotes`).
*   **Stateless Authentication (JWT)**: JSON Web Tokens ensure that no session state needs to be maintained on the server-side. This enhances scalability and resilience, as any server can validate a token independently, without relying on shared session storage. Tokens contain all necessary user information for authorization decisions.
*   **Defensive Programming**: The codebase incorporates defensive programming techniques such as explicit input type validation (`typeof email !== 'string'`) to prevent unexpected data types from causing vulnerabilities (e.g., NoSQL Injection attempts) and comprehensive error handling with global error middleware to gracefully manage exceptions.
*   **Secure Defaults**: The boilerplate uses libraries like `helmet` to automatically set secure HTTP headers, `express-rate-limit` to prevent abuse, and `express-mongo-sanitize` to clean input, ensuring that security best practices are applied by default without requiring explicit configuration for every endpoint. This reduces the attack surface and minimizes the risk of common misconfigurations.

```plaintext
npm run dev
```

```plaintext
npm install
```

```plaintext
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nodejs_boilerplate
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

```plaintext
git clone <repository_url>
cd nodejs-boilerplate
```