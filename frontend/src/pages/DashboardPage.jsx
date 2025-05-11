import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/dashboard/summary').then(res => setSummary(res.data));
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
  <h2 className="dashboard-title">Dashboard Overview</h2>

  <div className="summary-card">
    <p><strong>Total Students:</strong> {summary.totalStudents}</p>
    <p><strong>Vaccinated Students:</strong> {summary.vaccinatedStudents}</p>
    <p><strong>Vaccination Rate:</strong> {summary.vaccinationRate}%</p>
  </div>

  <h3 className="section-title">Upcoming Drives (next 30 days)</h3>
  {summary.upcomingDrives.length === 0 ? (
    <p className="empty-state">No upcoming drives</p>
  ) : (
    <ul className="drives-list">
      {summary.upcomingDrives.map(d => (
        <li key={d._id}>
          <strong>{d.vaccineName}</strong> on <em>{new Date(d.date).toLocaleDateString()}</em> for Grades: {d.grades.join(', ')}
        </li>
      ))}
    </ul>
  )}

  <hr className="divider" />

  <h3 className="section-title">Quick Navigation</h3>
  <div className="nav-buttons">
    <button onClick={() => navigate('/students')}>Manage Students</button>
    <button onClick={() => navigate('/drives')}>Manage Drives</button>
    <button onClick={() => navigate('/reports')}>View Reports</button>
  </div>
</div>
  );
}