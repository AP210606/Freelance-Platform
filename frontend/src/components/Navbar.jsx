import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    Freelance <span style={{ color: 'var(--clr-accent-blue)' }}>Connect</span>
                </Link>
                <div className="navbar-nav">
                    {user ? (
                        <>
                            <span className="welcome-text">Welcome, {user.name} ({user.role})</span>
                            {user.role === 'client' && (
                                <Link to="/client-dashboard" className="nav-link">Client Dashboard</Link>
                            )}
                            {user.role === 'freelancer' && (
                                <Link to="/freelancer-dashboard" className="nav-link">Freelancer Dashboard</Link>
                            )}
                            <Link to="/projects" className="nav-link">Browse Projects</Link>
                            <button onClick={logout} className="btn btn-secondary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-secondary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;