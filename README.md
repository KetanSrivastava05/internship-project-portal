# Internship & Project Management Portal

A comprehensive, production-ready web application designed to manage the complete lifecycle of internships and academic projects within a college-industry ecosystem. This system implements strict Role-Based Access Control (RBAC) and workflow-driven state transitions to ensure secure and structured management of student activities.

## 🚀 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Routing:** React Router
*   **Notifications:** React Hot Toast
*   **Icons:** Lucide React / Heroicons

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB Atlas (Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens) with strict RBAC middleware

### Infrastructure
*   **Containerization:** Docker & Docker Compose
*   **Web Server:** Nginx (Frontend Proxy)

---

## 👥 User Roles

The system supports 8 distinct roles, each with specific permissions and dashboards:

1.  **Student:** Apply for internships, submit weekly reports, view evaluations.
2.  **Company / Recruiter:** Post internships, shortlist candidates, interview and approve interns.
3.  **Faculty (Internal Mentor):** Post academic projects, review reports, mentor students.
4.  **External Mentor:** Industry experts helping with mentorship.
5.  **Evaluator:** Review completed work and grade students.
6.  **College Admin:** Manage academic credits, assign faculty.
7.  **TPO (Training & Placement Officer):** View analytics and reports.
8.  **System Admin:** Manage users, roles, and system configuration.

---

## 🔄 Workflows & State Transitions

The system enforces strict workflows. Actions must follow the predefined sequence:

### 📝 Application Lifecycle
`Applied` → `Shortlisted` → `Interviewed` → `Approved` OR `Rejected`

### 🎓 Internship Progress
`Approved` → `In Progress` → `Evaluated` → `Certified`

---

## 🌿 Branching Strategy

We follow a structured **Git Flow** strategy to ensure code stability and smooth collaboration.

### Main Branches
*   **`main` (or `master`):**
    *   The production-ready branch.
    *   Only compliant, tested, and approved code is merged here.
    *   Deploys directly to the production environment.
*   **`develop`:**
    *   The primary integration branch.
    *   All feature branches confirm here.
    *   Represents the latest delivered development changes for the next release.

### Supporting Branches
*   **Feature Branches (`feature/feature-name`):**
    *   Branched off `develop`.
    *   Used for developing new features (e.g., `feature/student-dashboard`).
    *   Merged back into `develop` via Pull Request (PR) after review.
*   **Hotfix Branches (`hotfix/bug-fix`):**
    *   Branched off `main`.
    *   Used for critical production bugs.
    *   Merged into both `main` and `develop`.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)
*   Docker (Optional)

### Environment Variables
Create a `.env` file in the `backend` directory (see `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internportal
JWT_SECRET=your_super_secret_key
node_env=development
```

### Running Locally (Manual)

1.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Running with Docker
```bash
docker-compose up --build
```

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
│   └── utils/          # Helper Functions
├── frontend/           # React Vite App
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Auth & State Context
│   │   ├── pages/      # Role-based Pages
│   │   └── api/        # Axios Setup
├── docker-compose.yml  # Container Orchestration
└── README.md           # Project Documentation
```
