// CustomerLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3002/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/customer/dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftPane}>
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button style={styles.outlinedButton} onClick={() => navigate('/customer/signup')}>
          SIGN UP
        </button>
      </div>

      <div style={styles.rightPane}>
        <h2 style={styles.title}>LOGIN</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <FiMail />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FiLock />
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

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
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
  input: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: '14px',
    paddingLeft: '8px'
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

export default CustomerLogin;
