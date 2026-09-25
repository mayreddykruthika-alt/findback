import React, { useState } from 'react';
import MatchCard from '../components/MatchCard';
import { GitCompare, ShieldAlert, Filter } from 'lucide-react';

export default function MatchesPage({ matches, onViewMatchDetail }) {
  const [filterThreshold, setFilterThreshold] = useState(0);

  const filteredMatches = matches.filter(m => m.match_score >= filterThreshold);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Intelligent Match Results</h1>
          <p>Multi-attribute similarity analysis comparing missing reports against unidentified records</p>
        </div>
      </div>

      <div className="disclaimer-banner">
        <ShieldAlert size={20} flexShrink={0} />
        <div>
          <strong>System Protocol:</strong> All results are classified as <strong>“Potential Match”</strong> to assist human forensic and law enforcement verification. Final confirmation requires authority investigation.
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} /> Filter Confidence:
        </span>
        <button 
          className={`btn ${filterThreshold === 0 ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          onClick={() => setFilterThreshold(0)}
        >
          All Matches ({matches.length})
        </button>
        <button 
          className={`btn ${filterThreshold === 50 ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          onClick={() => setFilterThreshold(50)}
        >
          ≥ 50% Match
        </button>
        <button 
          className={`btn ${filterThreshold === 70 ? 'btn-primary' : 'btn-secondary'}`} 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
          onClick={() => setFilterThreshold(70)}
        >
          ≥ 70% High Confidence
        </button>
      </div>

      {filteredMatches.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredMatches.map((match, idx) => (
            <MatchCard key={match._id || idx} match={match} onViewDetail={onViewMatchDetail} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <GitCompare size={40} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
          <h3>No Potential Matches Found</h3>
          <p>Go to <strong>Missing Persons</strong> and click <strong>"Find Potential Matches"</strong> on a record to trigger the intelligent comparison algorithm.</p>
        </div>
      )}
    </div>
  );
}
