import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectBids = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [project, setProject] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role !== 'client') {
                setError('Unauthorized. Only clients can manage bids for their projects.');
                setLoading(false);
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
                const fetchedProject = projectRes.data;

                if (fetchedProject.clientId._id !== user.id) {
                    setError('You are not authorized to view bids for this project.');
                    setLoading(false);
                    return;
                }
                setProject(fetchedProject);

                const bidsRes = await axios.get(`http://localhost:5000/api/bids/project/${id}`, config);
                setBids(bidsRes.data);
                setLoading(false);

            } catch (err) {
                console.error('Error fetching project bids:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to load project bids.');
                setLoading(false);
            }
        };

        if (token && user) {
            fetchData();
        }
    }, [id, user, token]);

    const handleAcceptBid = async (bidId) => {
        if (window.confirm('Are you sure you want to accept this bid? This will close bidding for this project and create a contract.')) {
            setMessage(null);
            setError(null);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`http://localhost:5000/api/bids/${bidId}/accept`, {}, config);
                setMessage('Bid accepted successfully! A contract has been created and other bids rejected.');
                navigate('/client-dashboard');
            } catch (err) {
                console.error('Error accepting bid:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to accept bid. Please try again.');
            }
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Loading bids...</div>;
    }

    if (error) {
        return <div className="flex-center error-message" style={{ minHeight: 'calc(100vh - 80px)' }}>{error}</div>;
    }

    if (!project) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Project details could not be loaded.</div>;
    }

    const hasAcceptedBid = project.acceptedBidId !== null;

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>Bids for "{project.title}"</h1>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-lg)' }}>Status: <span className={`status-${project.status.replace('_', '-')}`} style={{ fontWeight: 'bold' }}>{project.status.replace('_', ' ')}</span></p>

            {message && <div className="alert success-alert">{message}</div>}
            {error && <div className="alert error-alert">{error}</div>}

            {hasAcceptedBid ? (
                <div className="alert info-alert" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>A bid has already been accepted for this project. It is now {project.status.replace('_', ' ')}.</p>
                    <Link to="/client-dashboard" className="btn btn-secondary" style={{ marginTop: 'var(--spacing-md)', display: 'inline-block' }}>Go to Client Dashboard</Link>
                </div>
            ) : bids.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', padding: 'var(--spacing-xxl) 0' }}>No bids submitted for this project yet.</p>
            ) : (
                <div className="grid-layout">
                    {bids.map((bid) => (
                        <div key={bid._id} className="card bid-detail-card"> {/* Added bid-detail-card */}
                            <div>
                                <h3 style={{ color: 'var(--clr-accent-purple)', marginBottom: 'var(--spacing-sm)' }}>Bid from {bid.freelancerId?.name || 'Unknown Freelancer'}</h3>
                                <p style={{ color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }} className="line-clamp-4">{bid.message}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }}>
                                    <p><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Amount:</span> <span style={{ color: 'var(--clr-success)' }}>${bid.amount}</span></p>
                                    <p><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Timeline:</span> <span style={{ color: 'var(--clr-accent-blue)' }}>{bid.timeline}</span></p>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginTop: 'var(--spacing-md)' }}>Bid Status: <span className={`status-${bid.status}`} style={{ fontWeight: 'bold' }}>{bid.status}</span></p>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                {bid.status === 'pending' && project.status === 'open' && (
                                    <button onClick={() => handleAcceptBid(bid._id)} className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }}>Accept Bid</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ marginTop: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <Link to="/client-dashboard" className="btn btn-secondary">Back to Client Dashboard</Link>
            </div>
        </div>
    );
};

export default ProjectBids;