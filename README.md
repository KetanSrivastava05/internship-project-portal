# Internship & Project Management Portal

A comprehensive, production-ready web application designed to manage the complete lifecycle of internships and academic projects within a college-industry ecosystem. This system implements strict Role-Based Access Control (RBAC) and workflow-driven state transitions to ensure secure and structured management of student activities.

---

## 🌟 Project Vision & Scope

### 🎯 Vision Statement
To create a centralized, digital platform that streamlines the internship and project management process for colleges, ensuring transparent communication, efficient tracking, and structured evaluation between students, faculty mentors, and industry recruiters.

### ❓ Problem Statement
Managing student internships involves significant manual paperwork, scattered communication (emails/WhatsApp), and difficulty in tracking progress. Faculty struggle to monitor hundreds of students, and students often miss deadlines or lack visibility into their application status. This portal solves these issues by digitizing the entire workflow.

### 👥 Target Users (Personas)
*   **Students:** Seeking internships and needing valid project approval.
*   **Faculty Mentors:** Guiding students and grading their work.
*   **Recruiters:** Hiring talent from the college.
*   **Administrators:** overseeing the entire academic process.

### ✨ Key Features
*   **Role-Based Dashboards:** Specific views for Students, Faculty, Recruiters, and Admins.
*   **Workflow Automation:** Automated status transitions (Applied -> Shortlisted -> Interviewed).
*   **Digital Reporting:** Weekly progress reports and evaluations submitted online.
*   **Analytics:** TPO dashboard for placement statistics.

### 📈 Success Metrics
*   **Efficiency:** Reduction in time spent on manual tracking by 60%.
*   **Adoption:** 100% of final-year students registered on the portal.
*   **Transparency:** Real-time status updates for 100% of applications.

### ⚠️ Assumptions & Constraints
*   **Assumption:** All users have access to a device with internet connectivity.
*   **Constraint:** The system must integrate with the existing college legacy database (simulated for now).
*   **Constraint:** Strict data privacy laws (GDPR/DPDP) must be considered for student data.

---

## 🏗️ Architecture

The application follows a modern **Client-Server** architecture with a document-oriented database.

```mermaid
graph TD
    Client[Client (Browser/Mobile)] -->|HTTP/REST API| LB[Nginx / Load Balancer]
    LB -->|Forward Request| Server[Express.js Backend Server]
    
    subgraph Data Layer
        Server -->|Mongoose ODM| DB[(MongoDB Atlas)]
    end
    
    subgraph Infrastructure
        Docker[Docker Containers]
        Docker --> Client
        Docker --> Server
        Docker --> DB
    end
```

**Flow:** Frontend (React) -> API (Express) -> Controller -> Service -> Model -> Database (MongoDB).

---

## � Design & Prioritization

### 📋 User Stories
We have documented **25 key user stories** covering all roles to ensure comprehensive coverage. 
👉 **[View Full User Stories](USER_STORIES.md)**

### 🚀 MoSCoW Prioritization
*   **Must Have:** User Authentication (RBAC), Internship Posting, Application Workflow, Weekly Reporting.
*   **Should Have:** Email Notifications, Dashboard Analytics, Export to PDF/Excel.
*   **Could Have:** In-app Chat, AI-based Resume Parsing, Mobile App.
*   **Won't Have (v1):** Blockchain-based Certificate Verification, Video Interviewing Platform.

### 🖌️ Wireframes
Initial designs were created in Figma to ensure a user-centric experience.
*(Placeholder: Add link to Figma project here)*

---

## 🚀 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS (PostCSS & Autoprefixer)
*   **Animations:** Framer Motion
*   **State/Data:** Axios, React Context
*   **Icons:** Lucide React / Heroicons
*   **Formatting:** ESLint

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB Atlas (Mongoose ODM)
*   **Security:** Helmet, CORS, JWT, BcryptJS
*   **Logging:** Morgan

### Infrastructure
*   **Containerization:** Docker & Docker Compose
*   **Dev Tools:** Nodemon, Dotenv

---

## 🌿 Branching Strategy

We follow a structured **Git Flow** strategy:

*   **`main`**: Production-ready code.
*   **`develop`**: Integration branch for latest features.
*   **`feature/*`**: New features (e.g., `feature/student-dashboard`).
*   **`hotfix/*`**: Critical bug fixes.

---

## ⚡ Quick Start – Local Development

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
*   [Node.js v18+](https://nodejs.org/) (For manual setup)
*   Git

### Option 1: Using Docker (Recommended)
This will set up the Frontend, Backend, and MongoDB automatically.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KetanSrivastava05/internship-project-portal.git
    cd Project_Internship_Portal
    ```

2.  **Create Environment Variables:**
    Create a `.env` file in `./backend` (copy content from `.env.example`).

3.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    *   Frontend: `http://localhost:3000`
    *   Backend: `http://localhost:5000`
    *   MongoDB: `mongodb://localhost:27017`

### Option 2: Manual Setup

1.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Ensure MongoDB is running locally or provide Atlas URI in .env
    npm run dev
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *   App will run at `http://localhost:5173` (Vite default).

---

## 📸 Screenshots & Proof of Work

### 1. Docker Build Success
*(Placeholder: Add screenshot of terminal showing `docker-compose up` success)*

### 2. Application Running
*(Placeholder: Add screenshot of the Dashboard running in browser)*

### 3. Database Connection
*(Placeholder: Add screenshot of MongoDB Compass or Terminal showing connection)*

---

## 📂 Project Structure

```
Project_Internship_Portal/
├── backend/            # Express API Server
│   ├── config/         # DB and App Config
│   ├── controllers/    # Request Logic
│   ├── middleware/     # Auth & RBAC
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── Dockerfile      # Backend Container Config
├── frontend/           # React Vite App
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Role-based Pages
│   │   └── context/    # Auth & State Context
│   └── Dockerfile      # Frontend Container Config
├── docker-compose.yml  # Container Orchestration
├── USER_STORIES.md     # Detailed User Stories
└── README.md           # Project Documentation
```
