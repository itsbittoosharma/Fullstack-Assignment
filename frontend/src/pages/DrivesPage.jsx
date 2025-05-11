import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function DrivesPage() {
  const [form, setForm] = useState({
    vaccineName: '',
    date: '',
    dosesAvailable: '',
    grades: ''
  });
  const [editingId, setEditingId] = useState(null);

  const [drives, setDrives] = useState([]);

  const fetchDrives = async () => {
    const res = await API.get('/drives');
    setDrives(res.data);
  };

  useEffect(() => {
    fetchDrives(); 
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  const payload = {
    vaccineName: form.vaccineName,
    date: form.date,
    dosesAvailable: parseInt(form.dosesAvailable),
    grades: form.grades.split(',').map(g => g.trim())
  };

  try {
    if (editingId) {
      await API.put(`/drives/${editingId}`, payload);
    } else {
      await API.post('/drives', payload);
    }
    fetchDrives();
    setForm({ vaccineName: '', date: '', dosesAvailable: '', grades: '' });
    setEditingId(null);
  } catch (err) {
    alert(err.response?.data?.error || 'Drive operation failed');
  }
};

  return (
    <div className="drive-container">
  <h2 className="form-title">Create Vaccination Drive</h2>

  <div className="form-group">
    <input
      name="vaccineName"
      placeholder="Vaccine Name"
      value={form.vaccineName}
      onChange={handleChange}
      className="form-input"
    />
    <input
      name="date"
      type="date"
      value={form.date}
      onChange={handleChange}
      className="form-input"
    />
    <input
      name="dosesAvailable"
      placeholder="Doses Available"
      value={form.dosesAvailable}
      onChange={handleChange}
      className="form-input"
    />
    <input
      name="grades"
      placeholder="Grades (comma-separated)"
      value={form.grades}
      onChange={handleChange}
      className="form-input"
    />
    <button onClick={handleSave} className="primary-button">Create Drive</button>
  </div>

  <h3 className="section-title">Existing Drives</h3>
  <ul className="drives-list">
    {drives.map(d => (
      <li key={d._id} className="drive-item">
        <span>
          <strong>{d.vaccineName}</strong> — {new Date(d.date).toLocaleDateString()} — Grades: {d.grades.join(', ')}
        </span>
        {new Date(d.date) > new Date() && (
          <button
            onClick={() => {
              setForm({ ...d, grades: d.grades.join(', ') });
              setEditingId(d._id);
            }}
            className="edit-button"
          >
            Edit
          </button>
        )}
      </li>
    ))}
  </ul>
</div>
  );
}