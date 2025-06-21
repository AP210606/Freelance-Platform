import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projects');
                setProjects(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again later.');
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Loading projects...</div>;
    }

    if (error) {
        return <div className="flex-center error-message" style={{ minHeight: 'calc(100vh - 80px)' }}>{error}</div>;
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xxl)' }}>Available Projects</h1>
            {projects.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', padding: 'var(--spacing-xxl) 0' }}>No open projects available at the moment. Check back later!</p>
            ) : (
                <div className="grid-layout">
                    {projects.map((project) => (
                        <div key={project._id} className="card project-card">
                            <div>
                                <h2 className="text-truncate-single-line" style={{ color: 'var(--clr-accent-blue)', marginBottom: 'var(--spacing-sm)' }}>{project.title}</h2>
                                <p className="line-clamp-3" style={{ color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }}>{project.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }}>
                                    <span>Budget: <span style={{ color: 'var(--clr-text-dark)', fontWeight: 'bold' }}>${project.budget}</span></span>
                                    {project.deadline && <span style={{ textAlign: 'right' }}>Deadline: <span style={{ color: 'var(--clr-text-dark)', fontWeight: 'bold' }}>{new Date(project.deadline).toLocaleDateString()}</span></span>}
                                </div>
                            </div>
                            <Link to={`/projects/${project._id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', padding: '10px 0' }}>
                                View Details & Bid
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;