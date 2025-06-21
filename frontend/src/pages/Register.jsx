import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'client') {
            navigate('/client-dashboard');
        } else {
            navigate('/freelancer-dashboard');
        }
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const response = await register(name, email, password, role);
            setMessage('Registration successful! Redirecting...');
            if (response.user.role === 'client') {
                navigate('/client-dashboard');
            } else {
                navigate('/freelancer-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex-center">
            <div className="form-card">
                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Your Full Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role" className="label">Register as:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="select-field"
                        >
                            <option value="client">Client</option>
                            <option value="freelancer">Freelancer</option>
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: 'var(--spacing-lg)' }}>Register</button>
                </form>
                <p style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--clr-text-medium)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--clr-accent-blue)' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;