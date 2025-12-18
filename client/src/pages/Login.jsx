import React, { useState } from 'react';
import axios from 'axios';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3002';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try customer login first
      let response;
      try {
        response = await axios.post(`${AUTH_URL}/auth/login`, { email, password });
        
        // If customer login succeeds, check role and navigate
        if (response.data.status === 'success') {
          const userRole = response.data.user?.role || 'customer';
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Navigate based on role
          if (userRole === 'admin') {
            localStorage.setItem('admin', JSON.stringify(response.data.user));
            navigate('/admin/dashboard');
          } else {
            navigate('/customer/dashboard');
          }
          return;
        }
      } catch (customerErr) {
        // If customer login fails with "Customer not found", try admin login
        const errorMessage = customerErr.response?.data?.message || '';
        
        if (errorMessage.includes('Customer not found')) {
          // User might be an admin, try admin login
          try {
            response = await axios.post(`${AUTH_URL}/auth/admin/login`, { email, password });
            
            if (response.data.status === 'success') {
              const userRole = response.data.user?.role || 'admin';
              
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('admin', JSON.stringify(response.data.user));
              
              // Navigate to admin dashboard
              navigate('/admin/dashboard');
              return;
            }
          } catch (adminErr) {
            // Admin login also failed
            throw adminErr;
          }
        } else {
          // Other error (like wrong password for customer)
          throw customerErr;
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Please check your credentials and try again.';
      alert('Login failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>

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
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
    fontFamily: 'sans-serif',
  },
  loginBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '3rem 4rem',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#000000',
    fontWeight: '700',
    fontSize: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    position: 'relative',
    border: '2px solid #000000',
  },
  input: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: '14px',
    paddingLeft: '8px',
    color: '#000000',
  },
  toggle: {
    position: 'absolute',
    right: '12px',
    cursor: 'pointer',
    color: '#000000',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
  },
};

export default Login;
