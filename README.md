# ⚡ LinkForge — URL Shortener SaaS

A production-ready, full-stack **URL Shortener SaaS** built with **React + FastAPI + PostgreSQL**.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🏗️ Architecture

```
LinkForge/
├── backend/          # FastAPI + SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── routers/       # HTTP route handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database queries (Clean Architecture)
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic v2 schemas
│   │   ├── auth/          # JWT dependencies
│   │   ├── core/          # Config + security utilities
│   │   └── utils/         # Short codes, pagination, etc.
│   └── main.py
└── frontend/         # React + Vite + Tailwind v4 + shadcn/ui
    └── src/
        ├── pages/         # 14 pages
        ├── components/    # Reusable UI components
        ├── context/       # Auth, Theme, Toast
        ├── services/      # Axios API wrappers
        ├── routes/        # React Router + guards
        └── utils/         # Helpers
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL (or use SQLite for dev)

---

### 1. Backend Setup

```bash
cd backend

# Copy env file
cp .env.example .env
# Edit .env: set DATABASE_URL, SECRET_KEY, etc.

# Install dependencies
pip install -r requirements.txt

# Start server (SQLite by default in dev)
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Install dependencies
npm install

# Start dev server
npm run dev
```

App: http://localhost:5173

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# App: http://localhost
# API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## ✨ Features

| Module | Features |
|--------|---------|
| **Auth** | JWT + Refresh tokens, bcrypt, role-based access (User/Admin) |
| **URL Shortening** | Base62 short codes, custom aliases, expiration, password protection, tags |
| **QR Codes** | Auto-generated, PNG + SVG download, regenerate |
| **Analytics** | Per-click tracking (browser, device, country, referrer), Recharts charts |
| **Dashboard** | Stats cards, click trends, top URLs, recent activity |
| **Admin Panel** | User management, URL moderation, platform stats |
| **UI/UX** | Dark/light mode, Framer Motion animations, glassmorphism, Recharts |
| **Landing Page** | Hero, Features, Pricing, FAQ, Testimonials, Footer |
| **Deployment** | Docker + docker-compose + Nginx |

---

## 🔑 Default Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user |
| POST | `/urls` | Create short URL |
| GET | `/urls` | List user's URLs |
| GET | `/r/{short_code}` | Redirect (with analytics) |
| GET | `/analytics` | User analytics |
| GET | `/dashboard` | Dashboard stats |
| GET | `/admin/dashboard` | Admin stats (admin only) |

Full Swagger docs at: **http://localhost:8000/docs**

---

## 🛡️ Security

- **JWT** access tokens (30 min) + refresh tokens (7 days)
- **bcrypt** password hashing
- **Refresh token rotation** on every refresh
- **Role-based access control** (User / Admin)
- **Rate limiting** via slowapi
- **CORS** configured per environment
- **SQL injection** protection via SQLAlchemy ORM
- **Input validation** via Pydantic v2

---

## 📦 Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.111 | Web framework |
| SQLAlchemy | 2.0 | ORM |
| Pydantic | 2.7 | Validation |
| python-jose | 3.3 | JWT |
| passlib[bcrypt] | 1.7 | Password hashing |
| qrcode[pil] | 7.4 | QR generation |
| alembic | 1.13 | Migrations |
| slowapi | 0.1 | Rate limiting |
| uvicorn | 0.30 | ASGI server |

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 + Vite | UI framework |
| Tailwind CSS v4 | Styling |
| React Router v6 | Routing |
| TanStack Query | Server state |
| React Hook Form | Forms |
| Recharts | Charts |
| Framer Motion | Animations |
| Lucide React | Icons |
| Axios | HTTP client |

---

## 📁 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite:///./linkforge.db   # or postgresql://...
SECRET_KEY=your-secret-key-min-32-chars
BASE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:5173
SHORT_CODE_LENGTH=6
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📄 License

MIT © 2026 LinkForge
