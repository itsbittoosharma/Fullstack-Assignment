const studentRoutes = require('./routes/students');
const driveRoutes = require('./routes/drives');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.get('/', (req, res) => {
  res.send('School Vaccination API is running');
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

app.listen(5001, () => console.log("Server running on port 5001"));