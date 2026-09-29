# Client Project Management System

A web application for managing client projects and the work around them. The repository contains a React workspace UI and a Django REST API backed by PostgreSQL.

## Features

- Workspace views for projects, services, staff tasks, client portal, invoices, reports, notifications, and settings
- Login with JWT access and refresh tokens
- Account and profile APIs, including client and staff profiles
- Django admin for managing backend records
- Light/dark theme support in the frontend

The frontend also includes talent management and shared-report views. The available backend endpoints and integrations may not yet cover every workflow in the UI.

## Technology

- Frontend: React 19, Vite, React Router, Axios
- Backend: Python, Django, Django REST Framework, Simple JWT
- Database: PostgreSQL 16

## Repository Layout

```text
backend/       Django project and domain apps
frontend/      React application
docker-compose.yml  Local PostgreSQL service
.env.example  Backend configuration template
```

Backend domain apps include accounts, services, projects, milestones, feedback, invoices, and notifications.

## Requirements

- Python 3.12 or later
- Node.js and npm
- Docker Desktop (recommended for the local PostgreSQL database), or a compatible PostgreSQL server

## Run Locally (Windows PowerShell)

### 1. Configure the database

From the repository root, create the backend environment file and start PostgreSQL:

```powershell
Copy-Item .env.example .env
docker compose up -d db
```

The compose file publishes PostgreSQL on port `5434` and uses development credentials. Update the database values in the root `.env` to match the compose service:

```dotenv
DB_NAME=cpmpts
DB_USER=cpmpts_user
DB_PASSWORD=KZoooo23
DB_HOST=localhost
DB_PORT=5434
```

These credentials are for local development only. Change the compose password and the matching `.env` value before using this configuration beyond a local machine. Django reads `.env` from the repository root.

### 2. Install and start the backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API runs at `http://localhost:8000`; the Django admin is at `http://localhost:8000/admin/`.

### 3. Install and start the frontend

In a second terminal, from the repository root:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The frontend API base URL is configured by `VITE_API_BASE_URL` in `frontend/.env` and defaults to `http://localhost:8000/api/v1`.

### macOS/Linux note

Use `python3 -m venv .venv`, `source .venv/bin/activate`, and `cp .env.example .env` in place of the PowerShell virtual-environment and file-copy commands.

## API Overview

The API base URL is `http://localhost:8000/api/v1`. API routes do not use a trailing slash.

| Area | Resource routes |
| --- | --- |
| Accounts | `/users`, `/clients`, `/staff` |
| Services | `/services`, `/milestone-templates` |
| Projects | `/projects`, `/project-members`, `/progress-updates`, `/project-files` |
| Milestones | `/milestones`, `/tasks` |
| Feedback | `/feedback`, `/feedback-responses` |
| Billing | `/invoices`, `/invoice-items`, `/payments` |
| Notifications | `/notifications` |

Resource routes provide the standard Django REST Framework list, detail, create, update, and delete operations subject to each view's permissions. Additional endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Obtain JWT access and refresh tokens |
| `POST` | `/auth/refresh` | Refresh an access token |
| `GET`, `PATCH` | `/auth/me` | Get or update the authenticated user's profile |
| `GET`, `PATCH` | `/dashboard-pricing` | Read or update dashboard pricing (admin only) |
| `POST` | `/projects/{id}/add_update` | Add a project progress update |
| `POST` | `/projects/{id}/upload_file` | Upload a file to a project |
| `POST` | `/feedback/{id}/resolve` | Resolve feedback |
| `GET` | `/invoices/{id}/pdf` | Download an invoice PDF |
| `POST` | `/invoices/{id}/pay` | Record an invoice payment |
| `POST` | `/notifications/{id}/mark_read` | Mark one notification as read |
| `POST` | `/notifications/mark_all_read` | Mark the current user's notifications as read |
| `POST` | `/notifications/report-share` | Create a seven-day shared-report link |
| `POST` | `/notifications/report-schedule` | Schedule a report email delivery |
| `GET` | `/shared-reports/{token}` | View an active shared report without logging in |

The API uses JWT bearer authentication by default. Access tokens last one hour and refresh tokens last seven days. The frontend stores tokens in browser local storage and attempts to refresh an expired access token. Permissions vary by endpoint and user role (admin, staff, or client); shared reports are accessed through their token instead of a login.

## Scheduled Reports

The report scheduler command sends report deliveries that are due:

```powershell
python manage.py send_scheduled_reports
```

Run it periodically with a task scheduler or cron in deployments that need scheduled delivery. The default email backend writes messages to the Django console; configure `EMAIL_BACKEND`, `DEFAULT_FROM_EMAIL`, and the corresponding email-backend settings for actual delivery.

## Checks

Run Django tests from `backend/`:

```powershell
python manage.py test
```

Run frontend linting and a production build from `frontend/`:

```powershell
npm run lint
npm run build
```

When changing Django models, create and apply migrations from `backend/`:

```powershell
python manage.py makemigrations
python manage.py migrate
```

## Configuration

Backend settings are read from the repository-root `.env`; see `.env.example` for database, Django, and CORS variables. Frontend settings are read from `frontend/.env`; see `frontend/.env.example`. Backend dependencies are installed from `backend/requirements.txt`.

Do not use `DJANGO_DEBUG=True`, the example secret key, or the local database credentials in a production deployment. Configure a strong secret key, secure database credentials, allowed hosts, and production-appropriate email and static/media-file serving before deployment.
