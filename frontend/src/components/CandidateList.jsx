import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import axios from 'axios';

const CandidateList = ({ refreshTrigger }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, [refreshTrigger]);

  const fetchCandidates = async () => {
    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const { data } = await axios.get(`${API_URL}/api/candidates`);
      setCandidates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading candidates...</div>;

  return (
    <div className="card">
      <h2 className="card-title">
        <Users size={24} style={{ color: 'var(--accent)' }}/>
        All Candidates ({candidates.length})
      </h2>
      <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
        {candidates.map((c, idx) => (
          <div key={idx} className="candidate-item">
            <div className="candidate-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.email} • {c.experience} Years Exp.</p>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              {c.skills.map((skill, sIdx) => (
                <span key={sIdx} className="badge">{skill}</span>
              ))}
            </div>
            {c.projects && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.projects}</p>}
          </div>
        ))}
        {candidates.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No candidates found.</p>}
      </div>
    </div>
  );
};

export default CandidateList;
