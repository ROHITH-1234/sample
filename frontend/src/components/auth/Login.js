import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAlert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth', { email, password });
      
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Get user data
      const userRes = await axios.get('/api/auth', {
        headers: {
          'x-auth-token': res.data.token
        }
      });
      
      // Redirect based on user role
      if (userRes.data.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (userRes.data.role === 'company') {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setAlert(err.response.data.msg, 'danger');
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
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
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;