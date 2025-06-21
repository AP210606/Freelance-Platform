import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!user || user.role !== 'client') {
            setError('You must be logged in as a client to post a project.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const projectData = {
                title,
                description,
                budget: parseFloat(budget),
                deadline: deadline || undefined
            };
            await axios.post('http://localhost:5000/api/projects', projectData, config);
            setSuccess(true);
            setTitle('');
            setDescription('');
            setBudget('');
            setDeadline('');
            alert('Project posted successfully!');
            navigate('/client-dashboard');
        } catch (err) {
            console.error('Error posting project:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to post project. Please try again.');
        }
    };

    return (
        <div className="flex-center">
            <div className="form-card" style={{ maxWidth: '700px' }}> {/* Adjusted max-width for project form */}
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Post a New Project</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="label">Project Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="input-field"
                            placeholder="e.g., Develop a portfolio website"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="label">Project Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="7"
                            required
                            className="textarea-field"
                            placeholder="Provide detailed requirements for the project."
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="budget" className="label">Budget ($):</label>
                        <input
                            type="number"
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            min="0"
                            required
                            className="input-field"
                            placeholder="e.g., 1000"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deadline" className="label">Deadline (Optional):</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">Project posted successfully!</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', marginTop: 'var(--spacing-lg)' }}>Post Project</button>
                </form>
            </div>
        </div>
    );
};

export default PostProject;