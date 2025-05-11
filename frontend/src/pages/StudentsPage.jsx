import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', studentClass: '', studentId: '' });
  const [file, setFile] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState({});
  const [filters, setFilters] = useState({ name: '', class: '', studentId: '', status: 'all' });
  const [drives, setDrives] = useState([]);


const fetchDrives = async () => {
  const res = await API.get('/drives');
  setDrives(res.data);
};
  const fetchStudents = async () => {
  const res = await API.get('/students', { params: filters });
  setStudents(res.data);
};
const handleDriveSelect = (studentId, driveId) => {
  setSelectedDrive(prev => ({ ...prev, [studentId]: driveId }));
};
  useEffect(() => {
  fetchStudents();
  fetchDrives();
});

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  const payload = {
    name: form.name,
    class: form.studentClass,
    studentId: form.studentId
  };

  if (form._id) {
    await API.put(`/students/${form._id}`, payload);
  } else {
    await API.post('/students', payload);
  }

  fetchStudents();
  setForm({ name: '', studentClass: '', studentId: '' });
};
const handleVaccinate = async (studentId) => {
  const driveId = selectedDrive[studentId];
  const drive = drives.find(d => d._id === driveId);

  if (!drive) return alert("Please select a drive.");

  try {
    await API.post(`/students/${studentId}/vaccinate`, {
      vaccineName: drive.vaccineName,
      driveId
    });
    fetchStudents();
  } catch (err) {
    alert(err.response?.data?.error || 'Vaccination failed');
  }
};
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await API.post('/students/bulk-upload', formData);
    fetchStudents();
  };

  return (
    <div className="student-container">
  <h2 className="page-title">Student Management</h2>

  <div className="section">
    <h3>Add Student</h3>
    <div className="form-row">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" />
      <input name="studentClass" placeholder="Class" value={form.studentClass} onChange={handleChange} className="input" />
      <input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} className="input" />
      <button onClick={handleSubmit} className="primary-button">Add</button>
    </div>
  </div>

  <div className="section">
    <h3>Bulk Upload CSV</h3>
    <div className="form-row">
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} className="input" />
      <button onClick={handleFileUpload} className="secondary-button">Upload CSV</button>
    </div>
  </div>

  <div className="section">
    <h3>All Students</h3>
    <div className="form-row">
      <input placeholder="Name" name="name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="input" />
      <input placeholder="Class" name="class" onChange={(e) => setFilters({ ...filters, class: e.target.value })} className="input" />
      <input placeholder="Student ID" name="studentId" onChange={(e) => setFilters({ ...filters, studentId: e.target.value })} className="input" />
      <select name="status" onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input">
        <option value="all">All</option>
        <option value="vaccinated">Vaccinated</option>
        <option value="not_vaccinated">Not Vaccinated</option>
      </select>
      <button onClick={fetchStudents} className="primary-button">Search</button>
    </div>
  </div>

  <table className="styled-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Class</th>
        <th>Student ID</th>
        <th>Vaccinated</th>
        <th>Edit</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {students.map(s => (
        <tr key={s._id}>
          <td>{s.name}</td>
          <td>{s.class}</td>
          <td>{s.studentId}</td>
          <td>{s.vaccinations?.length > 0 ? 'Yes' : 'No'}</td>
          <td><button onClick={() => setForm(s)} className="secondary-button">Edit</button></td>
          <td>
            <select onChange={(e) => handleDriveSelect(s._id, e.target.value)} className="input">
              <option value="">Select Drive</option>
              {drives.map(d => (
                <option key={d._id} value={d._id}>
                  {d.vaccineName} ({new Date(d.date).toLocaleDateString()})
                </option>
              ))}
            </select>
            <button onClick={() => handleVaccinate(s._id)} className="primary-button">Vaccinate</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}