import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const MyContracts = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!user) {
            setError('You must be logged in to view contracts.');
            setLoading(false);
            return;
        }

        const fetchContracts = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/contracts/my-contracts', config);
                setContracts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching contracts:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to load your contracts.');
                setLoading(false);
            }
        };

        if (token) {
            fetchContracts();
        }
    }, [user, token]);

    const handleCompleteContract = async (contractId) => {
        if (window.confirm('Are you sure you want to mark this contract as completed? This action is irreversible.')) {
            setMessage(null);
            setError(null);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`http://localhost:5000/api/contracts/${contractId}/complete`, {}, config);
                setMessage('Contract marked as completed! Awaiting client approval.');
                setContracts(contracts.map(c => c._id === contractId ? { ...c, status: 'completed' } : c));
            } catch (err) {
                console.error('Error completing contract:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to mark contract as complete.');
            }
        }
    };

    const handleApproveContract = async (contractId) => {
        if (window.confirm('Are you sure you want to approve this contract and finalize payment? This action is irreversible.')) {
            setMessage(null);
            setError(null);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`http://localhost:5000/api/contracts/${contractId}/approve`, {}, config);
                setMessage('Contract approved and finalized!');
                setContracts(contracts.map(c => c._id === contractId ? { ...c, status: 'approved', paymentStatus: 'paid' } : c));
            } catch (err) {
                console.error('Error approving contract:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to approve contract.');
            }
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', fontSize: '1.2rem', color: 'var(--clr-text-medium)' }}>Loading your contracts...</div>;
    }

    if (error) {
        return <div className="flex-center error-message" style={{ minHeight: 'calc(100vh - 80px)' }}>{error}</div>;
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-xxl)' }}>Your Contracts</h1>
            {message && <div className="alert success-alert">{message}</div>} {/* Use custom alert classes */}
            {error && <div className="alert error-alert">{error}</div>}

            {contracts.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--clr-text-medium)', padding: 'var(--spacing-xxl) 0' }}>You don't have any active or completed contracts yet. Explore projects or await client acceptance!</p>
            ) : (
                <div className="grid-layout grid-cols-1-md-2"> {/* Use custom grid classes */}
                    {contracts.map((contract) => (
                        <div key={contract._id} className="card contract-card"> {/* Added contract-card */}
                            <div>
                                <h3 style={{ color: 'var(--clr-accent-blue)', marginBottom: 'var(--spacing-sm)' }}>{contract.projectId?.title || 'Project Title N/A'}</h3>
                                <p style={{ color: 'var(--clr-text-medium)', marginBottom: 'var(--spacing-md)' }} className="line-clamp-3">{contract.projectId?.description || 'Project description not available.'}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginTop: 'var(--spacing-md)' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Client:</span> <span style={{ color: 'var(--clr-accent-purple)' }}>{contract.clientId?.name || 'N/A'}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)' }}><span style={{ fontWeight: 'bold', color: 'var(--clr-text-light)' }}>Freelancer:</span> <span style={{ color: 'var(--clr-accent-blue)' }}>{contract.freelancerId?.name || 'N/A'}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)', marginTop: 'var(--spacing-md)' }}>Contract Status: <span className={`status-${contract.status.replace('_', '-')}`} style={{ fontWeight: 'bold' }}>{contract.status.replace('_', ' ')}</span></p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-medium)' }}>Payment Status: <span className={`status-${contract.paymentStatus}`} style={{ fontWeight: 'bold' }}>{contract.paymentStatus}</span></p>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {(user.role === 'freelancer' && contract.status === 'in_progress') && (
                                    <button onClick={() => handleCompleteContract(contract._id)} className="btn btn-primary">Mark as Completed</button>
                                )}
                                {(user.role === 'client' && contract.status === 'completed') && (
                                    <button onClick={() => handleApproveContract(contract._id)} className="btn btn-primary" style={{ backgroundColor: 'var(--clr-success)', boxShadow: '0 0 8px var(--clr-success)' }}>Approve & Finalize</button>
                                )}
                                <Link to={`/projects/${contract.projectId?._id}`} className="btn btn-secondary" style={{ width: '100%', padding: '10px 0' }}>View Project Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyContracts;