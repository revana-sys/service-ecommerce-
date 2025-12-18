import React, { useState } from 'react';
import axios from 'axios';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3002';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const CustomerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${AUTH_URL}/auth/signup`, {
        name,
        email,
        password,
        confirmPassword
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Signup successful!');
      navigate('/customer/login');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert('Signup failed: ' + (err.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftPane}>
        <h1>Welcome!</h1>
        <p>Create your account and start your journey with us</p>
        <button style={styles.outlinedButton} onClick={() => navigate('/customer/login')}>
          LOG IN
        </button>
      </div>

      <div style={styles.rightPane}>
        <h2 style={styles.title}>Create Your Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <FiUser style={styles.icon} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FiMail style={styles.icon} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FiLock style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <span style={styles.toggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div style={styles.inputGroup}>
            <FiLock style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        <p style={styles.text}>
          Already have an account?{' '}
          <a href="/customer/login" style={styles.link}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  leftPane: {
    flex: 1,
    background: 'linear-gradient(to right, #7b2ff7, #b057f7)', // purple gradient
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center'
  },
  rightPane: {
    flex: 1,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2rem 4rem',
    borderRadius: '0 10px 10px 0'
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '12px',
    position: 'relative'
  },
  icon: {
    marginRight: '10px',
    color: '#555'
  },
  input: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: '14px',
    paddingLeft: '8px',
    color: '#000'
  },
  toggle: {
    position: 'absolute',
    right: '12px',
    cursor: 'pointer',
    color: '#555'
  },
  button: {
    padding: '12px',
    backgroundColor: '#7b2ff7', // purple button
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  text: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666'
  },
  link: {
    color: '#7b2ff7',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  outlinedButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    color: '#fff',
    borderRadius: '20px',
    marginTop: '20px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default CustomerSignup;
