# ✅ Todoist-Style Task Manager

A full‑stack productivity app inspired by **Todoist**. The project includes a **Flask** backend (REST API with JWT authentication) and a **React + Tailwind** frontend. It supports tasks, optional projects/labels, user accounts, and secure API communication.

---

## Table of Contents

* [What is this program?](#what-is-this-program)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Monorepo Structure](#monorepo-structure)
* [Prerequisites](#prerequisites)
* [Setup — Backend (Flask)](#setup--backend-flask)
* [Setup — Frontend (React)](#setup--frontend-react)
* [Run the App (Dev)](#run-the-app-dev)
* [Environment Variables](#environment-variables)
* [Database & Migrations](#database--migrations)
* [Testing](#testing)
* [API Basics](#api-basics)
* [Common Issues & Fixes](#common-issues--fixes)
* [Future Improvements](#future-improvements)


---

## What is this program?

This is a **task management web app** where users can:

* Create an account and log in
* Create, update, complete, and delete tasks
* (Optional) Organize by projects/labels and due dates
* View stats/insights like completion rates

It’s designed for **practical full‑stack development** practice: authentication, REST APIs, frontend state management, and clean project structure.

---

## Features

*  JWT authentication (login/registration, protected routes)
*  Tasks CRUD (create/read/update/delete)
*  Toggle complete, due dates, priority
*  Profile onboarding (username, avatar)
*  CORS‑secured frontend↔backend communication
*  Tailwind CSS UI with modern components


---

## Tech Stack

**Backend:** Python, Flask, Flask‑SQLAlchemy, Flask‑Migrate, Flask‑Login, Flask‑JWT‑Extended, Marshmallow, Flask‑CORS
**Frontend:** React (Vite), Axios, React Router, lucide-react, jwt-decode, Tailwind CSS
**Database:** SQLite (dev) or PostgreSQL/MySQL (prod)

---

## Monorepo Structure

```
project-root/
├─ run.py
├─ requirements.txt
├─ .env
├─ Todo_App/
│  ├─ __init__.py
│  ├─ models.py
│  ├─ routes/
│  ├─ forms.py (optional)
│  ├─ templates/ static/ (optional)
│  └─ migrations/
├─ react-frontend/
│  ├─ index.html
│  ├─ package.json
│  ├─ src/
│  │  ├─ main.jsx / App.jsx
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ api/
│  └─ .env
└─ README.md
```

---

## Prerequisites

* Python 3.10+
* Node.js 18+
* Git

---

## Setup — Backend (Flask)

```bash
git clone <your-repo-url>.git
cd project-root
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# OR venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt #windows
pip3 install -r requiremnts.txt # macOS/Linux

```

Create `.env` and set environment variables (see [Environment Variables](#environment-variables))

```bash
flask db init
flask db migrate -m "init"
flask db upgrade
python run.py
```

---

## Setup — Frontend (React)

```bash
cd react-frontend
npm install
```



Run:

```bash
npm run dev
```

---

## Run the App (Dev)

Open **two terminals**:

1. Backend:

```bash
source venv/bin/activate
python run.py
```

2. Frontend:

```bash
cd Todo_App/static/react
npm run dev
```

---

## Environment Variables

Backend `.env`:

```
FLASK_APP=Todo_App
FLASK_ENV=development
SECRET_KEY=change-me
DATABASE_URL=change-me-too
JWT_SECRET_KEY=change-me-too
ACCESS_TOKEN_EXPIRES=change-me-too
CORS_ORIGINS=change-me-too
```



## Database & Migrations

```bash
flask db migrate -m "message"
flask db upgrade
```

Reset (dev only):

```bash
rm -f app.db
rm -rf Todo_App/migrations
flask db init && flask db migrate -m "init" && flask db upgrade
```



## API Basics

* Auth: JWT bearer tokens
* Endpoints:

  * `POST /api/auth/register`
  * `POST /api/auth/login`
  * `GET /api/tasks`
  * `POST /api/tasks`
  * `PUT /api/tasks/<id>`
  * `DELETE /api/tasks/<id>`

---

## Common Issues & Fixes

* **Port in use:** change port in `flask run` or Vite config
* **CORS errors:** ensure `CORS_ORIGINS` matches frontend URL
* **Venv activation issues (Windows):**

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## Future Improvements

* OAuth2 login
* Task reminders & notifications
* Subtasks, labels & filters
* Offline/PWA support
* CI/CD pipeline

---

## Minimal `run.py`

```python
from Todo_App import create_app
app = create_app()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

---


