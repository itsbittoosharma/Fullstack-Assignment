# School Vaccination Portal Documentation

## 1. System Overview

The **School Vaccination Portal** is a full-stack web application designed to streamline the management of student vaccination records in schools. It enables administrators to:

- Add/manage student data
- Schedule vaccination drives
- Track student vaccination status
- Generate reports
- Export data in CSV, Excel, or PDF formats

The system supports authentication simulation and offers interactive dashboards for better decision-making.

---

## 2. Full Application Architecture

### Architecture Layers

- **Frontend (React.js):**
  - Components for login, dashboard, student management, drives, and reports
  - Communicates with backend using Axios
  - Styled using CSS

- **Backend (Node.js + Express):**
  - RESTful API server
  - Business logic and data processing
  - CSV parsing and file handling

- **Database (MongoDB):**
  - Stores student records, vaccination data, and drive information

### Data Flow

1. **Frontend** sends requests to **Backend APIs**
2. Backend fetches or stores data in **MongoDB**
3. Data is returned and rendered in the frontend

---

## 3. Frontend-Backend Interaction

| Action | Frontend Trigger | Backend API | Response |
|-------|-------------------|-------------|----------|
| Login | Button click | `/login` (mock) | Success (mock user object) |
| View Dashboard | Component mount | `/dashboard/summary` | JSON summary |
| Add Student | Form submit | `/students` (POST) | Student object |
| Upload CSV | File input | `/students/upload` | Import status |
| Create Drive | Form submit | `/drives` (POST) | Drive object |
| View Reports | Filters applied | `/reports` | Paginated report data |

---

## 4. API Endpoints (Postman)

You can test and explore all APIs using Postman.

### Postman Collection:

**[Download Postman Collection](#)** (replace with real link if hosted)

### Sample Endpoints:

#### 📘 Students

- `GET /students` — List all students (with filters)
- `POST /students` — Add new student
- `PUT /students/:id` — Update student
- `DELETE /students/:id` — Delete student
- `POST /students/upload` — Bulk upload CSV
- `POST /students/:id/vaccinate` — Mark vaccinated

#### Drives

- `GET /drives` — List drives
- `POST /drives` — Create drive
- `PUT /drives/:id` — Edit drive

#### Reports

- `GET /reports` — Filtered reports
- `GET /reports/download` — Download CSV

---

## 5. Database Schema

### Students

```json
{
  "_id": "ObjectId",
  "name": "string",
  "class": "string",
  "studentId": "string",
  "vaccinations": [
    {
      "vaccineName": "string",
      "date": "Date"
    }
  ]
}