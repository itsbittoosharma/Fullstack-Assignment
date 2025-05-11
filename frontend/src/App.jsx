import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import DrivesPage from './pages/DrivesPage';
import ReportsPage from './pages/ReportsPage';
import './index.css';  // Make sure this points to your Tailwind CSS file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/drives" element={<DrivesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;