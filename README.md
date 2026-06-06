# Warehouse Backend API

Backend API for a warehouse management system.
Built as a learning project to understand real-world backend architecture using NestJS.

## 🧠 Project Goals
- Learn NestJS fundamentals (modules, controllers, services, guards)
- Practice backend architecture and separation of concerns
- Work with relational databases and ORM
- Build real business logic (stock management, orders, suppliers)
- Learn DevOps basics (Docker, CI/CD)

## 🛠 Tech Stack
- **NestJS 11** — modular Node.js framework
- **TypeScript** — static typing
- **PostgreSQL 16** — relational database
- **Prisma 7** — ORM with migrations and type-safe queries
- **JWT** — stateless authentication (access tokens)
- **bcrypt** — password hashing
- **Passport.js** — authentication middleware (passport-jwt strategy)
- **class-validator + class-transformer** — DTO validation
- **Docker + Docker Compose** — local PostgreSQL setup
- **@nestjs/config** — environment variable management
- **@nestjs/swagger** — OpenAPI documentation (planned)
- **GitHub Actions** — CI/CD pipeline (planned)

## 📦 Modules

| Module | Endpoints | Status |
|---|---|---|
| Auth | POST /auth/register, POST /auth/login, GET /auth/me | ✅ Done |
| Products | CRUD /products | ✅ Done |
| Warehouses | CRUD /warehouses | ✅ Done |
| Suppliers | CRUD /suppliers | ✅ Done |
| Inventory | GET /inventory, POST /inventory/adjust, POST /inventory/transfer | 🔲 In progress |
| Orders | CRUD /orders, PATCH /orders/:id/status | 🔲 Planned |

## 🧱 Architecture

```
Request → Controller (routing) → Service (business logic) → PrismaService → PostgreSQL
```

- **Controllers** — handle HTTP, extract params/body, call services
- **Services** — business logic, database queries via Prisma
- **DTOs** — validate incoming data with class-validator decorators
- **Guards** — protect routes (JwtAuthGuard)
- **PrismaModule** — global singleton database client

## 🚀 Getting Started

### Prerequisites
- Node.js 24 LTS
- Docker Desktop

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.example .env
```
Fill in `.env`:
```env
DATABASE_URL="postgresql://warehouse_user:warehouse_pass@localhost:5432/warehouse_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### 3. Start database
```bash
docker compose up -d
```

### 4. Run migrations
```bash
npx prisma migrate dev
```

### 5. Start development server
```bash
npm run start:dev
```

API available at `http://localhost:3000`

## 📚 Planned Features
- Inventory management (stock levels, transfers between warehouses)
- Orders (inbound/outbound with status tracking)
- Swagger / OpenAPI documentation
- Unit and E2E tests (Jest + Supertest)
- GitHub Actions CI/CD pipeline
- Dockerfile for NestJS app

