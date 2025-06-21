import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, user } = useAuth();
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
        try {
            const response = await login(email, password);
            if (response.user.role === 'client') {
                navigate('/client-dashboard');
            } else {
                navigate('/freelancer-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex-center">
            <div className="form-card">
                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: 'var(--spacing-lg)' }}>Login</button>
                </form>
                <p style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--clr-text-medium)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--clr-accent-blue)' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;