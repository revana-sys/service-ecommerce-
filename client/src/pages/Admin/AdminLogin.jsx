import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3002';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Save admin data and token to localStorage
      localStorage.setItem('admin', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
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
    background: 'linear-gradient(135deg, #7b2ff7 0%, #b057f7 100%)',
    fontFamily: 'sans-serif',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: '3rem 4rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(123, 47, 247, 0.3)',
    width: '350px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '2rem',
    color: '#7b2ff7',
    fontWeight: '700',
    fontSize: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    borderRadius: '25px',
    backgroundColor: '#7b2ff7',
    color: '#fff',
    fontWeight: '600',
    fontSize: '18px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s',
  },
};

export default AdminLogin;
