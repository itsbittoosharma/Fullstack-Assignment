import React, { useEffect, useState } from 'react';
import API from '../services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadPDF = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Vaccination Report", 14, 15);

  const tableData = data.map(s => {
    const v = s.vaccinations[0] || {};
    return [
      s.name,
      s.class,
      s.studentId,
      s.vaccinations.length > 0 ? "Yes" : "No",
      v.date ? new Date(v.date).toLocaleDateString() : "",
      v.vaccineName || ""
    ];
  });

  doc.autoTable({
    head: [["Name", "Class", "Student ID", "Vaccinated", "Vaccination Date", "Vaccine Name"]],
    body: tableData,
    startY: 25,
  });

  doc.save("Vaccination_Report.pdf");
};

export default function ReportsPage() {
  const [filters, setFilters] = useState({ vaccineName: '', class: '', status: 'all' });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchReports = async (page = 1) => {
    const res = await API.get('/reports', {
      params: {
        ...filters,
        page,
        limit: 10
      }
    });
    setData(res.data.data);
    setPagination({ page: res.data.page, pages: res.data.pages });
  };

  useEffect(() => {
    fetchReports(1);
  }); // Add dependency array to avoid repeated fetching

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchReports(1);
  };

  const downloadCSV = () => {
    window.open('http://localhost:5001/api/reports/download', '_blank');
  };

  const downloadExcel = () => {
    const worksheetData = data.map(s => {
      const v = s.vaccinations[0] || {};
      return {
        Name: s.name,
        Class: s.class,
        "Student ID": s.studentId,
        Vaccinated: s.vaccinations.length > 0 ? "Yes" : "No",
        "Vaccination Date": v.date ? new Date(v.date).toLocaleDateString() : "",
        "Vaccine Name": v.vaccineName || ""
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vaccination Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Vaccination_Report.xlsx");
  };


  return (
    <div className="report-container">
      <h2 className="report-title">Vaccination Report</h2>

      <div className="filter-section">
        <input
          name="vaccineName"
          placeholder="Vaccine Name"
          value={filters.vaccineName}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          name="class"
          placeholder="Class"
          value={filters.class}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="all">All</option>
          <option value="vaccinated">Vaccinated</option>
          <option value="not_vaccinated">Not Vaccinated</option>
        </select>
        <button onClick={applyFilters} className="primary-button">Filter</button>
        <button onClick={downloadCSV} className="secondary-button">Download CSV</button>
        <button onClick={downloadExcel} className="secondary-button">Download Excel</button>
        <button onClick={() => downloadPDF(data)} className="secondary-button">Download PDF</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Student ID</th>
            <th>Vaccinations</th>
          </tr>
        </thead>
        <tbody>
          {data.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.studentId}</td>
              <td>
                {s.vaccinations.length > 0
                  ? s.vaccinations.map(v => `${v.vaccineName} (${new Date(v.date).toLocaleDateString()})`).join(', ')
                  : 'None'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        Page {pagination.page} of {pagination.pages}
        <div className="page-buttons">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchReports(i + 1)}
              className={pagination.page === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}