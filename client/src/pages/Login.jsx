import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = role === 'admin'
        ? 'http://localhost:3002/auth/admin/login'
        : 'http://localhost:3002/auth/login';

      const response = await axios.post(url, { email, password });

      if (role === 'customer') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/customer/dashboard');
      } else {
        localStorage.setItem('admin', JSON.stringify(response.data));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>{role === 'admin' ? 'Admin' : 'Customer'} Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

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
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #000000',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: 'white',
    color: '#000000',
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
