import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FreelancerDashboard = () => {
    const { user, token } = useAuth();
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'freelancer') {
            setError('Unauthorized access. Please login as a freelancer.');
            setLoading(false);
            return;
        }

        const fetchMyBids = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/bids/my-bids', config);
                setMyBids(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching freelancer bids:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to load your bids.');
                setLoading(false);
            }
        };

        if (token) {
            fetchMyBids();
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
            <h1 style={{ marginBottom: 'var(--spacing-xxl)' }}>Freelancer Dashboard</h1>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
                <Link to="/projects" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Browse Available Projects</Link>
            </div>

            <h2 style={{ textAlign: 'left', fontSize: '2rem', marginBottom: 'var(--spacing-lg)' }}>Your Bids</h2>
            {myBids.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', padding: 'var(--spacing-xxl) 0' }}>You haven't placed any bids yet. Start browsing projects!</p>
            ) : (
                <div className="grid-layout">
                    {myBids.map((bid) => (
                        <div key={bid._id} className="card bid-card"> {/* Added bid-card for specific styling */}
                            <div>
                                <h3 style={{ color: 'var(--clr-accent-purple)', marginBottom: 'var(--spacing-sm)' }}>Bid for: {bid.projectId?.title || 'Project Title N/A'}</h3>
                                <p style={{ color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }} className="line-clamp-3">{bid.message}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)' }}>Bid Amount: <span style={{ color: 'var(--clr-text-light)', fontWeight: 'bold' }}>${bid.amount}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)' }}>Timeline: <span style={{ color: 'var(--clr-text-light)', fontWeight: 'bold' }}>{bid.timeline}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginTop: 'var(--spacing-md)' }}>Bid Status: <span className={`status-${bid.status}`} style={{ fontWeight: 'bold' }}>{bid.status.replace('_', ' ')}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)' }}>Project Status: <span className={`status-${bid.projectId?.status.replace('_', '-')}`} style={{ fontWeight: 'bold' }}>{bid.projectId?.status.replace('_', ' ') || 'N/A'}</span></p>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <Link to={`/projects/${bid.projectId?._id}`} className="btn btn-secondary" style={{ width: '100%', padding: '10px 0' }}>
                                    View Project
                                </Link>
                                {bid.status === 'accepted' && bid.projectId?.status === 'in_progress' && (
                                    <Link to="/my-contracts" className="btn btn-primary" style={{ width: '100%', padding: '10px 0' }}>
                                        Go to Contract
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

export default FreelancerDashboard;