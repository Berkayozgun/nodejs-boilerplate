# 🛡️ Enterprise Node.js & Express Boilerplate

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20XSS%20%7C%20Rate%20Limit-red?style=for-the-badge)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A robust, security-first Node.js and Express backend starter kit designed for enterprise-level applications. This boilerplate implements strict Layered Architecture principles, comprehensive security measures, and a fully automated CI/CD pipeline out of the box.

## 🏗️ Architecture & Core Features

* **Layered Architecture:** Clear separation of concerns utilizing Controllers, Services, Models, and Middlewares.
* **Advanced Security:** Pre-configured with `Helmet` (HTTP header security), `XSS-Clean` (cross-site scripting protection), `HPP` (HTTP parameter pollution prevention), and `express-rate-limit`.
* **Authentication & Authorization:** Secure JWT (JSON Web Token) implementation with role-based access control and `bcrypt` password hashing.
* **Database Integration:** Scalable MongoDB modeling using `Mongoose` ORM.
* **Continuous Integration:** Automated testing and build verification via GitHub Actions on every push and pull request.
* **Error Handling:** Global error handling middleware ensuring consistent API responses and clean console outputs.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Berkayozgun/nodejs-boilerplate.git
cd nodejs-boilerplate
npm install
```

### 2. Environment Setup
Rename the provided environment template and configure your local/production values.
```bash
cp .env.example .env
```

### 3. Run the Application
For local development with hot-reloading:
```bash
npm run dev
```
For production environments:
```bash
npm start
```

## 🧪 CI/CD Pipeline
This repository uses **GitHub Actions** for Continuous Integration. Every commit to the `main` branch automatically triggers the Node.js CI workflow to verify dependency installation and validate the build process, ensuring zero downtime and deployment safety.
