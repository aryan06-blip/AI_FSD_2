import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import axios from 'axios';

const JobRequirementForm = ({ onShortlist }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingBasic, setLoadingBasic] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const parsePayload = () => {
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    return {
      requiredSkills: skillsArray,
      minExperience: Number(formData.minExperience) || 0
    };
  };

  const handleBasicMatch = async () => {
    setLoadingBasic(true);
    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const { data } = await axios.post(`${API_URL}/api/match`, parsePayload());
      onShortlist(data, 'basic');
    } catch (error) {
      console.error(error);
      alert('Error fetching matches');
    } finally {
      setLoadingBasic(false);
    }
  };

  const handleAIMatch = async () => {
    setLoadingAI(true);
    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const { data } = await axios.post(`${API_URL}/api/ai/shortlist`, parsePayload());
      onShortlist(data.evaluations || [], 'ai');
    } catch (error) {
      console.error(error);
      alert('Error fetching AI recommendations');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Briefcase size={24} style={{ color: 'var(--accent)' }}/>
        Job Requirements
      </h2>
      <div className="form-group">
        <label>Required Skills (comma separated)</label>
        <input type="text" name="requiredSkills" className="form-control" required value={formData.requiredSkills} onChange={handleChange} placeholder="e.g. React, Node.js" />
      </div>
      <div className="form-group">
        <label>Minimum Experience (Years)</label>
        <input type="number" name="minExperience" className="form-control" required min="0" value={formData.minExperience} onChange={handleChange} placeholder="e.g. 1" />
      </div>
      <div className="grid" style={{ gap: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={handleBasicMatch} disabled={loadingBasic || loadingAI || !formData.requiredSkills}>
          {loadingBasic ? <div className="spinner"></div> : 'Basic Algorithm Match'}
        </button>
        <button type="button" className="btn" onClick={handleAIMatch} disabled={loadingBasic || loadingAI || !formData.requiredSkills}>
          {loadingAI ? <div className="spinner"></div> : 'AI Intelligent Ranking'}
        </button>
      </div>
    </div>
  );
};

export default JobRequirementForm;
