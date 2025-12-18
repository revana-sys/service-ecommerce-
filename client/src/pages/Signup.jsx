import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3002';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${AUTH_URL}/auth/signup`, {
        name: fullName,
        email,
        password,
        confirmPassword,
      });

      console.log('Signup successful:', response.data);
      alert('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      alert(`Signup failed: ${errorMsg}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.brand}>RS Style</h1>
        <h2 style={styles.title}>Create Your Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <div style={styles.links}>
          Already have an account?
          <Link to="/login" style={styles.link}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  brand: {
    color: '#000000',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  title: {
    fontSize: '20px',
    marginBottom: '30px',
    color: '#333333',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    border: '2px solid #000000',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#000000',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: '#333333',
      outline: 'none',
    },
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  links: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#333333',
  },
  link: {
    color: '#000000',
    textDecoration: 'none',
    marginLeft: '5px',
    fontWeight: '600',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#333333',
    },
  },
};

export default Signup;