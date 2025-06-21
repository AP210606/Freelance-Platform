import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
    const { user, token } = useAuth();
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'client') {
            setError('Unauthorized access. Please login as a client.');
            setLoading(false);
            return;
        }

        const fetchMyProjects = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/projects/my-projects', config);
                setMyProjects(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching client projects:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to load your projects.');
                setLoading(false);
            }
        };

        if (token) {
            fetchMyProjects();
        }
    }, [user, token]);

    if (loading) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Loading your dashboard...</div>;
    }

    if (error) {
        return <div className="flex-center error-message" style={{ minHeight: 'calc(100vh - 80px)' }}>{error}</div>;
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xxl)' }}>Client Dashboard</h1>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
                <Link to="/post-project" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Post a New Project</Link>
            </div>

            <h2 style={{ textAlign: 'left', fontSize: '2rem', marginBottom: 'var(--spacing-lg)' }}>Your Posted Projects</h2>
            {myProjects.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', padding: 'var(--spacing-xxl) 0' }}>You haven't posted any projects yet. Start by posting one!</p>
            ) : (
                <div className="grid-layout">
                    {myProjects.map((project) => (
                        <div key={project._id} className="card project-card">
                            <div>
                                <h3 style={{ color: 'var(--clr-accent-blue)', marginBottom: 'var(--spacing-sm)' }}>{project.title}</h3>
                                <p style={{ color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }} className="line-clamp-3">{project.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }}>
                                    <span>Budget: <span style={{ color: 'var(--clr-text-light)', fontWeight: 'bold' }}>${project.budget}</span></span>
                                    {project.deadline && <span style={{ textAlign: 'right' }}>Deadline: <span style={{ color: 'var(--clr-text-light)', fontWeight: 'bold' }}>{new Date(project.deadline).toLocaleDateString()}</span></span>}
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginTop: 'var(--spacing-md)' }}>Status: <span className={`status-${project.status.replace('_', '-')}`} style={{ fontWeight: 'bold' }}>{project.status.replace('_', ' ')}</span></p>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <Link to={`/projects/${project._id}`} className="btn btn-secondary" style={{ width: '100%', padding: '10px 0' }}>
                                    View Details
                                </Link>
                                {project.status === 'open' && (
                                    <Link to={`/projects/${project._id}/bids`} className="btn btn-primary" style={{ width: '100%', padding: '10px 0' }}>
                                        Manage Bids
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
             <div style={{ marginTop: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)' }}>Your Active Contracts</h2>
                <p style={{ color: 'var(--clr-text-medium)', fontSize: '1.1rem', marginBottom: 'var(--spacing-lg)' }}>Manage your ongoing and completed projects here.</p>
                <Link to="/my-contracts" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>View All Contracts</Link>
            </div>
        </div>
    );
};

export default ClientDashboard;