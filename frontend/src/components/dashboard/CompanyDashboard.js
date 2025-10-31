import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyDashboard = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    keywords: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // Get company profile
        const companyRes = await axios.get('/api/companies/me', config);
        setCompany(companyRes.data);

        // Get company jobs
        const jobsRes = await axios.get('/api/jobs/company', config);
        setJobs(jobsRes.data);

        // Get job applications
        const applicationsRes = await axios.get('/api/applications/company', config);
        setApplications(applicationsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onChange = e => setJobForm({ ...jobForm, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/jobs', jobForm, config);
      setJobs([res.data, ...jobs]);
      
      // Clear form
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        keywords: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      await axios.put(`/api/applications/${applicationId}`, { status }, config);
      
      // Update application status in state
      setApplications(
        applications.map(app => 
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="large text-primary">Company Dashboard</h1>
      
      {company ? (
        <div className="company-profile">
          <h2>{company.name}</h2>
          <p>{company.industry} | {company.location}</p>
          <p>{company.description}</p>
        </div>
      ) : (
        <div className="alert alert-warning">
          Please complete your company profile
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-jobs">
          <h2>Post a New Job</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Job Title"
                name="title"
                value={jobForm.title}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Job Description"
                name="description"
                value={jobForm.description}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Requirements"
                name="requirements"
                value={jobForm.requirements}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Location"
                name="location"
                value={jobForm.location}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Salary"
                name="salary"
                value={jobForm.salary}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <select name="jobType" value={jobForm.jobType} onChange={onChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Keywords (comma separated)"
                name="keywords"
                value={jobForm.keywords}
                onChange={onChange}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Post Job" />
          </form>

          <h2>Your Job Listings</h2>
          {jobs.length > 0 ? (
            <div className="jobs">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.location} | {job.jobType}</p>
                  <p className="job-date">Posted on {new Date(job.date).toLocaleDateString()}</p>
                  <p>Applications: {job.applications ? job.applications.length : 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No jobs posted yet</p>
          )}
        </div>

        <div className="dashboard-applications">
          <h2>Recent Applications</h2>
          {applications.length > 0 ? (
            <div className="applications">
              {applications.map(app => (
                <div key={app._id} className="application-card">
                  <h3>{app.job.title}</h3>
                  <p>Candidate: {app.candidate.name}</p>
                  <p>Match Score: {app.matchScore}%</p>
                  <p>Status: {app.status}</p>
                  <div className="application-actions">
                    <button 
                      onClick={() => updateApplicationStatus(app._id, 'reviewing')}
                      className="btn btn-light"
                    >
                      Review
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app._id, 'accepted')}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app._id, 'rejected')}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications received yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;