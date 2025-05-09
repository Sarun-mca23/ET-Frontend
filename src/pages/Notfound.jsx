// src/components/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom'; // If you want a link back to the homepage

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go to Homepage</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '48px',
    color: '#ff0000',
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  link: {
    fontSize: '16px',
    color: '#5879f3',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default NotFound;
