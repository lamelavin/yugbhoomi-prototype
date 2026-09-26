# YugBhoomi

### Predictive Analytics System for Early Detection of Land Acquisition Delays

YugBhoomi is a web-based platform designed to monitor land acquisition projects, visualize project progress, identify potential delays, and support risk-based decision making through analytics and predictive modeling.

This repository currently contains the **frontend implementation** of YugBhoomi. The backend, database, GIS infrastructure, and AI/ML services are part of the planned system architecture and are being developed separately.

---

## Features

The current frontend includes:

* Dashboard
* Project management
* Project details and progress tracking
* Interactive map interface
* Risk analysis
* Project assessment
* Alerts
* Reports
* Document management
* Settings
* Risk visualization
* Project stage tracking
* Mock project data
* Frontend API layer for future backend integration
* Heuristic risk fallback for demonstration

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Apache ECharts
* MapLibre GL JS
* Leaflet
* React-Leaflet

## Backend — Planned

* Java 21
* Spring Boot 3.x
* Maven
* Spring Security
* JWT
* Spring Data JPA
* Hibernate

## Database & GIS — Planned

* PostgreSQL
* PostGIS

## AI / ML — Planned

* Python
* FastAPI
* Pandas
* NumPy
* scikit-learn
* XGBoost / LightGBM
* SHAP

## Application Services — Planned

* REST APIs
* Rule-based Recommendation Engine
* Spring Scheduler
* In-app Alerts
* Email Notifications
* PDF / CSV Reports
* Audit Logging
* Role-Based Access Control

## DevOps & Deployment — Planned

* Docker
* Docker Compose
* Nginx
* Git
* GitHub
* GitHub Actions

---

# System Architecture

The intended YugBhoomi architecture consists of several layers:

```text
                    ┌─────────────────────────┐
                    │       Frontend          │
                    │ React + TypeScript      │
                    │ Tailwind + shadcn/ui    │
                    │ ECharts + MapLibre      │
                    └────────────┬────────────┘
                                 │
                                 │ REST APIs
                                 ▼
                    ┌─────────────────────────┐
                    │      Backend API        │
                    │ Java 21                 │
                    │ Spring Boot             │
                    │ Spring Security + JWT   │
                    │ Spring Data JPA         │
                    └───────┬─────────┬───────┘
                            │         │
                 ┌──────────┘         └─────────────┐
                 ▼                                  ▼
       ┌───────────────────┐              ┌───────────────────┐
       │ PostgreSQL        │              │ AI / ML Services  │
       │ + PostGIS         │              │ Python + FastAPI  │
       └───────────────────┘              │ ML + Explainability│
                                          └───────────────────┘
```

Additional application services such as scheduling, notifications, reporting, recommendations, and audit logging will integrate with the backend.

---

# Current Implementation Status

| Component                | Status        |
| ------------------------ | ------------- |
| Frontend UI              | ✅ Implemented |
| Dashboard                | ✅ Implemented |
| Project Management UI    | ✅ Implemented |
| GIS Map UI               | ✅ Implemented |
| Risk Analysis UI         | ✅ Implemented |
| Assessment UI            | ✅ Implemented |
| Alerts UI                | ✅ Implemented |
| Reports UI               | ✅ Implemented |
| Documents UI             | ✅ Implemented |
| Settings UI              | ✅ Implemented |
| Frontend API Layer       | 🟡 Prepared   |
| Java Spring Boot Backend | 🔲 Planned    |
| PostgreSQL Database      | 🔲 Planned    |
| PostGIS Integration      | 🔲 Planned    |
| AI/ML Services           | 🔲 Planned    |
| Authentication & RBAC    | 🔲 Planned    |
| Notifications            | 🔲 Planned    |
| Reporting Services       | 🔲 Planned    |
| Docker Deployment        | 🔲 Planned    |
| CI/CD                    | 🔲 Planned    |

---

# Frontend Development

### Prerequisites

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone git@github.com:lamelavin/yugbhoomi-prototype.git
cd yugbhoomi-prototype
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The variable is reserved for communication with the backend API.

`.env.local` is excluded from version control.

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

Run the production build:

```bash
npm start
```

---

# Backend Integration

The current frontend includes an API abstraction layer intended to communicate with the YugBhoomi backend.

The backend is **not included in this repository yet**.

During frontend development, mock project data and fallback risk calculations are used where appropriate so that the interface can be developed and demonstrated independently of the backend.

Once the backend is implemented, the frontend API layer will be connected to the Spring Boot and AI/ML services.

---

# Project Context

YugBhoomi is being developed for **Smart India Hackathon (SIH) 2026**.

### Problem Statement

**Predictive Analytics System for Early Detection of Land Acquisition Delays**

The objective is to build a system capable of monitoring land acquisition projects, analyzing project-level risk factors, visualizing geographic information, and providing early indications of potential delays.

---

# Repository Status

This repository represents the **current frontend/prototype stage** of YugBhoomi.

The overall technology stack described above represents the intended architecture of the complete system and should not be interpreted as indicating that all listed components are currently implemented in this repository.

