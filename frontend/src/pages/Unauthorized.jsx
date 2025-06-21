import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex-center" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}> {/* Semi-transparent red overlay */}
      <div className="form-card" style={{ borderColor: 'var(--clr-error)', boxShadow: '0 0 15px var(--clr-error)' }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--clr-error)', marginBottom: 'var(--spacing-md)' }}>403 - Access Denied</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--clr-text-light)', marginBottom: 'var(--spacing-lg)' }}>You do not have the necessary permissions to view this page.</p>
        <Link to="/" className="btn btn-danger" style={{ padding: '12px 24px' }}>Go to Homepage</Link>
      </div>
    </div>
  );
};

export default Unauthorized;