import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setAlert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    role: 'candidate'
  });

  const { email, password, password2, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      try {
        const res = await axios.post('/api/users', {
          email,
          password,
          role
        });
        
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        
        // Redirect based on user role
        if (role === 'candidate') {
          navigate('/candidate/dashboard');
        } else if (role === 'company') {
          navigate('/company/dashboard');
        }
      } catch (err) {
        setAlert(err.response.data.msg, 'danger');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <select name="role" value={role} onChange={onChange}>
            <option value="candidate">Job Seeker</option>
            <option value="company">Employer</option>
          </select>
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;