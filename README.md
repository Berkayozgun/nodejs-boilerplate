# 🛡️ Production-Ready Node.js Boilerplate

A robust, security-first Node.js/Express starter kit designed for enterprise-level applications. Implements **Layered Architecture** and industry best practices out of the box.

![Node.js](https://img.shields.io/badge/Node.js-18-green) ![Express](https://img.shields.io/badge/Express-4.x-grey) ![Security](https://img.shields.io/badge/Security-Hardened-red) ![License](https://img.shields.io/badge/License-MIT-blue)

---

### 🚀 Features & Best Practices

#### 🔒 Advanced Security
- **Helmet:** Sets secure HTTP headers to protect against well-known web vulnerabilities.
- **Rate Limiting:** IP-based request throttling to prevent Brute-Force and DDoS attacks.
- **NoSQL Injection Protection:** Sanitizes user inputs using `express-mongo-sanitize`.
- **XSS Clean:** Prevents Cross-Site Scripting attacks by sanitizing request data.
- **HPP:** Protects against HTTP Parameter Pollution attacks.

#### 🏗 Layered Architecture
Strict separation of concerns for maintainability and scalability:
- `src/controllers` -> Business Logic
- `src/models` -> Data Layer (Mongoose Schemas)
- `src/routes` -> Endpoint Definitions
- `src/middlewares` -> Interceptors (Auth, Error Handling)
- `src/utils` -> Helper functions (Logger, API Features)

#### 📝 Logging & Error Handling
- **Centralized Error Handler:** Catches operational errors (Validation, Duplication, CastError) and sends standardized JSON responses.
- **Winston Logger:** Multi-transport logging system writing to `application.log` (general info) and `error.log` (critical issues).

#### 📚 API Documentation
- Integrated **Swagger UI** (`/api-docs`) auto-generated from JSDoc comments, making frontend integration seamless.

---

### 📦 Quick Start

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Berkayozgun/nodejs-boilerplate.git](https://github.com/Berkayozgun/nodejs-boilerplate.git)
   cd nodejs-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:** Rename `.env.example` to `.env` and update your MongoDB URI.

4. **Run the application:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Explore API:** Visit `http://localhost:5000/api-docs` to see the endpoints.
