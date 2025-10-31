import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidateDashboard = () => {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // Get candidate profile
        const candidateRes = await axios.get('/api/candidates/me', config);
        setCandidate(candidateRes.data);

        // Get recommended jobs
        const jobsRes = await axios.get('/api/jobs/recommended', config);
        setJobs(jobsRes.data);

        // Get candidate applications
        const applicationsRes = await axios.get('/api/applications/me', config);
        setApplications(applicationsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`/api/ai/search?query=${searchQuery}`, config);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/applications', { job: jobId }, config);
      setApplications([res.data, ...applications]);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      };

      await axios.put('/api/candidates/resume', formData, config);
      
      // Get updated candidate profile
      const candidateRes = await axios.get('/api/candidates/me', config);
      setCandidate(candidateRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="large text-primary">Candidate Dashboard</h1>
      
      {candidate ? (
        <div className="candidate-profile">
          <h2>{candidate.name}</h2>
          <p>Skills: {candidate.skills.join(', ')}</p>
          {candidate.resume ? (
            <p>Resume: {candidate.resume} <button className="btn btn-light">Update</button></p>
          ) : (
            <div className="form-group">
              <input type="file" onChange={uploadResume} />
              <small>Upload your resume for better job matching</small>
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-warning">
          Please complete your candidate profile
        </div>
      )}

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Search for jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-jobs">
          <h2>AI Recommended Jobs</h2>
          {jobs.length > 0 ? (
            <div className="jobs">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.company.name} | {job.location} | {job.jobType}</p>
                  <p className="job-date">Posted on {new Date(job.date).toLocaleDateString()}</p>
                  <p>Match Score: {job.matchScore}%</p>
                  <button 
                    onClick={() => applyForJob(job._id)}
                    className="btn btn-primary"
                    disabled={applications.some(app => app.job._id === job._id)}
                  >
                    {applications.some(app => app.job._id === job._id) ? 'Applied' : 'Apply'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No recommended jobs yet. Complete your profile for better matches.</p>
          )}

          {searchResults.length > 0 && (
            <>
              <h2>Search Results</h2>
              <div className="jobs">
                {searchResults.map(job => (
                  <div key={job._id} className="job-card">
                    <h3>{job.title}</h3>
                    <p>{job.company.name} | {job.location} | {job.jobType}</p>
                    <p className="job-date">Posted on {new Date(job.date).toLocaleDateString()}</p>
                    <p>Match Score: {job.matchScore}%</p>
                    <button 
                      onClick={() => applyForJob(job._id)}
                      className="btn btn-primary"
                      disabled={applications.some(app => app.job._id === job._id)}
                    >
                      {applications.some(app => app.job._id === job._id) ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dashboard-applications">
          <h2>Your Applications</h2>
          {applications.length > 0 ? (
            <div className="applications">
              {applications.map(app => (
                <div key={app._id} className="application-card">
                  <h3>{app.job.title}</h3>
                  <p>Company: {app.job.company.name}</p>
                  <p>Status: {app.status}</p>
                  <p>Applied on: {new Date(app.date).toLocaleDateString()}</p>
                  <p>Match Score: {app.matchScore}%</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications submitted yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;