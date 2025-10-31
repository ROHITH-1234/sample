import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import CompanyDashboard from './components/dashboard/CompanyDashboard';
import Alert from './components/layout/Alert';
import './App.css';

const App = () => {
  const [alerts, setAlerts] = useState([]);

  // Set alert
  const setAlert = (msg, alertType, timeout = 5000) => {
    const id = Math.random().toString(36).substring(7);
    setAlerts([...alerts, { msg, alertType, id }]);

    setTimeout(() => setAlerts(alerts.filter(alert => alert.id !== id)), timeout);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Alert alerts={alerts} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setAlert={setAlert} />} />
          <Route path="/register" element={<Register setAlert={setAlert} />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;