# ExpressJS Production Setup

**A modern production-ready Express.js API boilerplate** A scalable,
maintainable, and best-practice backbone for backend APIs using TypeScript,
Prisma, JWT authentication, validation, and robust testing.

---

## 📌 Overview

This repository provides a **production-grade Express.js API foundation** —
architected for real-world applications, developer productivity, and team
collaboration.

Key technologies included:

- **Express.js** — minimal, performant backend framework ([GitHub][1])
- **TypeScript** — static typing for reliability
- **Prisma ORM** — database access via type-safe queries
- **Zod** — schema validation for requests
- **JWT Auth** — secure token-based authentication
- **Vitest** — blazing fast test runner
- **Prisma + Test DB support**
- **Environment variable configs** for dev/test/prod

---

## 📦 Features

- 🧠 Standard API patterns (routes → handlers → services)
- 🔒 Authentication using JWT stored in HttpOnly cookies
- 🛡 Request validation with **Zod**
- 📊 Strong database tooling with **Prisma**
- 🧪 Fast isolated tests with **Vitest**
- 🚀 TypeScript configured end-to-end
- 🧹 Clean project structure suitable for scaling

---

## 🚀 Quickstart

### 🎯 Prerequisites

You’ll need:

- Node.js >= 18 installed
- npm installed
- A **PostgreSQL** database (or configure another supported DB)
- Environment variables configured

---

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure Environment

Create `.env` and `.env.test` (for test DB):

```bash
cp .env.example .env
cp .env.example .env.test
```

Update the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your_jwt_secret"
```

---

### 3. Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Create initial migrations and apply:

```bash
npx prisma migrate dev --name init
```

Alternatively, push schema (no migrations):

```bash
npx prisma db push
```

---

### 4. Run in Development

```bash
npm run dev
```

---

### 5. Build & Run in Production

```bash
npm run build
npm start
```

---

## 🧪 Testing

### 🧠 Fast Test Runner (Vitest)

Run tests:

```bash
npm test
# or
npx vitest run
```

💡 Use `.env.test` for pointing tests at a dedicated test database — tests clean
up after themselves and run isolated. ([GitHub][2])

---

## 🧩 Project Structure (Example)

```
src/
├── app.ts            # Express app factory (testable)
├── server.ts         # App bootstrap & start
├── routes.ts         # Router definitions
├── features/         # Feature modules (e.g., auth, profiles)
├── middlewares/      # Shared middlewares (auth, validation)
├── utils/            # General utilities/helpers
├── types/            # General types
├── config/           # General configs
prisma/
├── schema.prisma     # DB schema
generated/
├── prisma/           # Generated Prisma client
```

This pattern encourages separation of concerns and scalable code growth.

---

## 🛠 Best Practices Included

✔ **Environment separation** (dev/test/prod) with `.env` and strong type safety
([GitHub][3]) ✔ **JWT Authentication** with secure cookie storage ✔
**Validation** of all request input using Zod ✔ **Testable architecture** ready
for CI/CD ✔ **Prisma migrations + client generation** ✔ **Consistent TypeScript
developer experience**

---

## 🧠 Performance & Production Tips

For Express in production, consider:

- Setting `NODE_ENV=production` to enable optimizations ([Express][4])
- Running behind a process manager (e.g., PM2)
- Using load balancing and clustering if needed
- Caching responses using Redis or CDN layers

---

## ❓ Common Issues & Tips

- **Validation returning 500** — ensure Zod errors are properly caught and
  return meaningful 400s. ([Compile N Run][5])
- **Test collisions** — always run tests with a dedicated test database.
  ([GitHub][2])
- **JWT errors** — check your JWT secret and expiration configuration.

---

## 🤝 Contributing

Contributions are welcome! Typical workflow:

1. Fork the repository
2. Create a feature branch
3. Add tests + docs
4. Open a pull request

Please ensure tests pass before submitting.

---

## 📜 License

**MIT License**

---
