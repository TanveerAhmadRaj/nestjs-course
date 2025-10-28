# 🧩 Task Management Application

> A complete and versatile backend API built with **NestJS**, featuring authentication, role-based access control, and task management modules (Users, Roles, and Labels).

---

## 🚀 Overview

The **Task Management Application** provides a robust API for managing users, roles, tasks, and labels.  
It uses **JWT authentication**, **Role-based Guards**, and **TypeORM** for PostgreSQL integration.  
Built for scalability and clean modular architecture.

---

## 🧰 Tech Stack

- **NestJS** — Scalable Node.js framework for backend APIs  
- **TypeORM** — ORM for PostgreSQL  
- **PostgreSQL** — Relational database  
- **JWT (JSON Web Token)** — Authentication and Authorization  
- **Docker** — Containerized deployment and database setup  

---

## ⚙️ Features

- 🔐 **Authentication** — Login, JWT-based auth, and user sessions  
- 🧑‍💻 **Role-based Guards** — Access control using custom `RolesGuard`  
- 🧱 **Task Management** — Create, update, and manage tasks  
- 🏷️ **Labels** — Assign labels to categorize tasks  
- 👥 **User Management** — Create and manage users with roles  
- 🧩 **Typed Configuration** — Strongly typed config service  
- 🧰 **Modular Structure** — Clean, maintainable, and extensible design  

---

## 🧾 Environment Variables

Copy the example below into a `.env` file at your project root:

```bash
APP_MESSAGE_PREFIX='Implemented by Full Stack Developer --> (Tanveer Ahmad)'
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=tasks
DB_SYNC=1
PORT=3000
JWT_SECRET=dd9944467e0816bc02a54036a54c1980dd8526ba4c7662d903ff2946f4985c06
JWT_EXPIRES_IN=60m



# Build and start containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down


# Clone repository
git clone https://github.com/TanveerAhmadRaj/nestjs-course.git

# Navigate to project folder
cd nestjs-course

# Install dependencies
npm install

# Run database (ensure PostgreSQL is running locally)

# Run in development mode
npm run start:dev

# Generate Migrations command
npm run migration:generate

# Run Migrations
npm run migration:run

