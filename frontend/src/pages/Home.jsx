import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex-center home-page-bg"> {/* Custom background gradient class */}
            <div className="form-card animate-fade-in-up" style={{ maxWidth: '800px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-lg)' }}>
                    Connect. Collaborate. <span style={{ color: 'var(--clr-accent-blue)' }}>Create.</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--clr-text-light)', marginBottom: 'var(--spacing-xl)', lineHeight: '1.8' }}>
                    Your go-to platform for finding top freelance talent and exciting projects. Whether you're a client looking to get work done or a freelancer ready to offer your skills, we've got you covered.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Get Started</Link>
                    <Link to="/projects" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Browse Projects</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;