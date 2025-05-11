# School Vaccination Portal

A full-stack web application for managing and tracking student vaccinations in a school environment. It enables school coordinators to schedule vaccination drives, manage student records, track vaccination statuses, and generate reports.

---

## Features

- Simulated login for school coordinator
- Dashboard with metrics and upcoming drives
- Add/edit individual student details
- Bulk import students using CSV
- Schedule/manage vaccination drives
- Mark students as vaccinated per drive
- Filterable, paginated vaccination reports
- CSV report download support

---

## How to Run the Application

### Prerequisites

- Node.js and npm installed
- Internet connection

---

### Backend Setup

1. Navigate to the backend folder:

cd backend

2. Install dependencies:

npm install

3. Create a `.env` file:

MONGO_URI=mongodb://localhost:27017/school_vaccine

4. Start the backend server:

npm run dev

5. Backend runs at:

http://localhost:5001

---

### Frontend Setup

1. Open a new terminal and go to the frontend folder:

cd frontend

2. Install dependencies:

npm install

3. Start the React app:

npm start

4. Frontend runs at:

http://localhost:3000

---

## Key Learnings

- Full-stack app structure with React + Node.js
- MongoDB schema design with Mongoose
- REST API development with validation
- Real-world workflows (vaccination logic, scheduling)
- File uploads with Multer and CSV parsing
- Frontend routing and state handling in React
- Report filtering, pagination, and CSV export

---

## Simulated Login

- Username: `admin`
- No password required
- Used only to simulate coordinator access

---

## Sample User Stories Covered

- View dashboard with student and drive metrics
- Add/manage students individually or in bulk
- Schedule new vaccination drives
- Vaccinate students using a drive dropdown
- Generate and export vaccination reports

---
