# Warehouse Backend API

Backend API for a warehouse and invoice management system.
Built as a learning project to understand real-world backend architecture using Nest.js.

## 🧠 Project Goals
- Learn Nest.js fundamentals
- Practice backend architecture (modules, services, DTOs)
- Work with relational databases
- Build real business logic (invoices, stock movements)

## 🛠 Tech Stack
- Nest.js
- TypeScript
- PostgreSQL (Supabase)
- Prisma ORM
- REST API
- class-validator

## 📦 Core Features
- Purchase invoices
- Sales invoices
- Product management
- Product generator from invoice items
- Warehouse stock management
- Stock movements history

## 🧱 Architecture
- Modular Nest.js structure
- Controllers → Services → Database
- Business logic separated from HTTP layer

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Create .env file:
```env 
DATABASE_URL=postgresql://...
```

### 3. Database setup
```bash
npx prisma migrate dev
```
### 4. Run development server
```bash
npm run start:dev
```
API will be available at:
``` arduino
http://localhost:3000
```

### 5.📚 Planned Features

Authentication (JWT)

Role-based access

Invoice PDF upload

Swagger / OpenAPI documentation


## Badges

- `Learning Project`
- `Work in Progress`
