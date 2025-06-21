import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidTimeline, setBidTimeline] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [bidSuccess, setBidSuccess] = useState(false);
    const [bidError, setBidError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
                setProject(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to load project details. It might not exist or there was a server error.');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, token]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setBidError(null);
        setBidSuccess(false);

        if (!user || user.role !== 'freelancer') {
            setBidError('You must be logged in as a freelancer to submit a bid.');
            return;
        }

        if (project.status !== 'open') {
             setBidError('This project is no longer open for bids.');
             return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const bidData = {
                projectId: id,
                amount: parseFloat(bidAmount),
                timeline: bidTimeline,
                message: bidMessage
            };
            await axios.post('http://localhost:5000/api/bids', bidData, config);
            setBidSuccess(true);
            setBidAmount('');
            setBidTimeline('');
            setBidMessage('');
            alert('Your bid has been submitted successfully!');
            navigate(`/freelancer-dashboard`);
        } catch (err) {
            console.error('Error submitting bid:', err.response ? err.response.data : err.message);
            setBidError(err.response?.data?.message || 'Failed to submit bid. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Loading project details...</div>;
    }

    if (error) {
        return <div className="flex-center error-message" style={{ minHeight: 'calc(100vh - 80px)' }}>{error}</div>;
    }

    if (!project) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Project not found.</div>;
    }

    const isClientOfThisProject = user && user.role === 'client' && project.clientId._id === user.id;
    const isFreelancer = user && user.role === 'freelancer';

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <div className="card project-detail-card"> {/* Added project-detail-card */}
                <h1 style={{ textAlign: 'left', fontSize: '2.8rem', marginBottom: 'var(--spacing-md)' }}>{project.title}</h1>
                <p style={{ color: 'var(--clr-text-light)', fontSize: '1.1rem', marginBottom: 'var(--spacing-lg)', lineHeight: '1.8' }}>{project.description}</p>
                <div className="project-meta-grid"> {/* Custom grid for meta */}
                    <div>
                        <p style={{ fontSize: '1.1rem' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Budget:</span> <span style={{ color: 'var(--clr-accent-blue)' }}>${project.budget}</span></p>
                        {project.deadline && <p style={{ fontSize: '1.1rem', marginTop: 'var(--spacing-sm)' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>}
                    </div>
                    <div className="meta-right"> {/* Custom class for right alignment */}
                        <p style={{ fontSize: '1.1rem' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Status:</span> <span className={`status-${project.status.replace('_', '-')}`} style={{ fontWeight: 'bold' }}>{project.status.replace('_', ' ')}</span></p>
                        <p style={{ fontSize: '1.1rem', marginTop: 'var(--spacing-sm)' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Client:</span> <span style={{ color: 'var(--clr-accent-purple)' }}>{project.clientId.name}</span></p>
                    </div>
                </div>
            </div>

            {isFreelancer && project.status === 'open' && (
                <div className="form-card bid-submit-card"> {/* Custom styling for bid submit */}
                    <h2 style={{ fontSize: '2.2rem', marginBottom: 'var(--spacing-xl)' }}>Submit Your Bid</h2>
                    <form onSubmit={handleBidSubmit}>
                        <div className="form-group">
                            <label htmlFor="bidAmount" className="label">Bid Amount ($):</label>
                            <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                min="0"
                                required
                                className="input-field"
                                placeholder="e.g., 500"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bidTimeline" className="label">Estimated Timeline (e.g., "7 days", "2 weeks"):</label>
                            <input
                                type="text"
                                id="bidTimeline"
                                value={bidTimeline}
                                onChange={(e) => setBidTimeline(e.target.value)}
                                required
                                className="input-field"
                                placeholder="e.g., 5 days"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bidMessage" className="label">Your Proposal / Message:</label>
                            <textarea
                                id="bidMessage"
                                value={bidMessage}
                                onChange={(e) => setBidMessage(e.target.value)}
                                rows="5"
                                required
                                className="textarea-field"
                                placeholder="Describe your approach, experience, and why you're the best fit."
                            ></textarea>
                        </div>
                        {bidError && <p className="error-message">{bidError}</p>}
                        {bidSuccess && <p className="success-message">Bid submitted successfully!</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: 'var(--spacing-lg)' }}>Submit Bid</button>
                    </form>
                </div>
            )}

            {isClientOfThisProject && (
                <div className="card client-project-management-card"> {/* Custom styling for client management */}
                    <h2 style={{ fontSize: '2.2rem', marginBottom: 'var(--spacing-lg)' }}>Bids for Your Project</h2>
                    {project.status === 'open' ? (
                        <p style={{ textAlign: 'center', color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }}>You can view and manage bids that freelancers have submitted for this project.</p>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--clr-status-completed)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>This project is now {project.status.replace('_', ' ')}. No new bids can be accepted.</p>
                    )}
                    <div style={{ textAlign: 'center' }}>
                        <Link to={`/projects/${project._id}/bids`} className="btn btn-primary" style={{ padding: '12px 24px' }}>View & Manage Bids</Link>
                    </div>
                </div>
            )}

            {(!isClientOfThisProject && !isFreelancer) && (
                <div className="card guest-call-to-action-card"> {/* Custom styling for guest view */}
                    <p style={{ textAlign: 'center', color: 'var(--clr-text-light)', fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Login or register as a freelancer to bid on this project!</p>
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px' }}>Register Now</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;