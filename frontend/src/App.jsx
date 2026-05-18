import React, { useState } from 'react';
import CandidateForm from './components/CandidateForm';
import JobRequirementForm from './components/JobRequirementForm';
import CandidateList from './components/CandidateList';
import ShortlistedCandidates from './components/ShortlistedCandidates';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [shortlistResults, setShortlistResults] = useState(null);
  const [shortlistMode, setShortlistMode] = useState(''); // 'basic' or 'ai'
  const [activeTab, setActiveTab] = useState('match'); // 'match' or 'manage'

  const handleCandidateAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleShortlist = (results, mode) => {
    setShortlistResults(results);
    setShortlistMode(mode);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>TalentMatch AI</h1>
        <p>Intelligent Candidate Shortlisting System</p>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Candidates
          </button>
          <button 
            className={`tab ${activeTab === 'match' ? 'active' : ''}`}
            onClick={() => setActiveTab('match')}
          >
            Job Matching
          </button>
        </div>
      </div>

      {activeTab === 'manage' && (
        <div className="grid fade-in">
          <CandidateForm onCandidateAdded={handleCandidateAdded} />
          <CandidateList refreshTrigger={refreshTrigger} />
        </div>
      )}

      {activeTab === 'match' && (
        <div className="fade-in">
          <JobRequirementForm onShortlist={handleShortlist} />
          <ShortlistedCandidates results={shortlistResults} mode={shortlistMode} />
        </div>
      )}
    </div>
  );
}

export default App;
