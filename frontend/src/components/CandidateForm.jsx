import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import axios from 'axios';

const CandidateForm = ({ onCandidateAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    projects: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = {
        ...formData,
        skills: skillsArray,
        experience: Number(formData.experience)
      };
      
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      await axios.post(`${API_URL}/api/candidates`, payload);
      setSuccess('Candidate added successfully!');
      setFormData({ name: '', email: '', skills: '', experience: '', projects: '' });
      if (onCandidateAdded) onCandidateAdded();
    } catch (error) {
      console.error('Error adding candidate:', error);
      setSuccess('Failed to add candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <UserPlus size={24} className="text-accent" style={{ color: 'var(--accent)' }}/>
        Add Candidate
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} placeholder="e.g. rahul@example.com" />
        </div>
        <div className="grid">
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" name="skills" className="form-control" required value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" />
          </div>
          <div className="form-group">
            <label>Experience (Years)</label>
            <input type="number" name="experience" className="form-control" required min="0" value={formData.experience} onChange={handleChange} placeholder="e.g. 2" />
          </div>
        </div>
        <div className="form-group">
          <label>Projects / Bio (Optional)</label>
          <textarea name="projects" className="form-control" value={formData.projects} onChange={handleChange} placeholder="Brief bio or links to projects..." />
        </div>
        {success && <p style={{ color: success.includes('Failed') ? 'var(--warning)' : 'var(--success)', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Save Candidate'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
