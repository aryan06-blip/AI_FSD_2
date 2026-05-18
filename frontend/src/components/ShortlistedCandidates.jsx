import React from 'react';
import { Award, Zap } from 'lucide-react';

const ShortlistedCandidates = ({ results, mode }) => {
  if (!results) return null;
  if (results.length === 0) return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <p style={{ color: 'var(--text-secondary)' }}>No matches found based on the requirements.</p>
    </div>
  );

  return (
    <div className="card" style={{ marginTop: '2rem', borderColor: mode === 'ai' ? 'var(--accent)' : 'var(--card-border)' }}>
      <h2 className="card-title">
        {mode === 'ai' ? <Zap size={24} style={{ color: 'var(--warning)' }} /> : <Award size={24} style={{ color: 'var(--success)' }} />}
        {mode === 'ai' ? 'AI Recommended Candidates' : 'Basic Match Results'}
      </h2>
      <div>
        {results.map((c, idx) => (
          <div key={idx} className="candidate-item">
            <div className="candidate-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  {idx + 1}. {c.candidateName || c.name}
                </h3>
                {mode === 'basic' && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.email} • {c.experience} Years Exp.</p>
                )}
              </div>
              {mode === 'basic' && (
                <div className={`score ${c.matchScore >= 80 ? '' : c.matchScore >= 50 ? 'medium' : 'low'}`}>
                  {c.matchScore.toFixed(0)}% Match
                </div>
              )}
            </div>
            
            {mode === 'basic' && c.matchedSkills && (
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Matched Skills:</span>
                {c.matchedSkills.map((s, sIdx) => (
                  <span key={sIdx} className="badge">{s}</span>
                ))}
              </div>
            )}

            {mode === 'ai' && c.explanation && (
              <div className="explanation">
                <strong>Why Recommended:</strong> {c.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
