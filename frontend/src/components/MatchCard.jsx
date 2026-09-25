import React from 'react';
import { CheckCircle2, AlertTriangle, Eye, ArrowRight, ShieldAlert } from 'lucide-react';

export default function MatchCard({ match, onViewDetail }) {
  const score = match.match_score;
  const missing = match.missing_person || {};
  const unidentified = match.unidentified_person || {};

  let scoreColor = 'var(--emerald-green)';
  let scoreBg = 'var(--bg-accent-green)';
  if (score < 50) {
    scoreColor = 'var(--text-muted)';
    scoreBg = 'var(--bg-subtle)';
  } else if (score < 75) {
    scoreColor = 'var(--amber-warning)';
    scoreBg = 'var(--bg-accent-amber)';
  }

  return (
    <div className="card match-card">
      <div className="match-score-header">
        <div className="match-score-pill">
          <div 
            className="badge" 
            style={{ backgroundColor: scoreBg, color: scoreColor, padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
          >
            <ShieldAlert size={16} />
            {match.classification || "Potential Match"}
          </div>
          <span className="score-number" style={{ color: scoreColor }}>
            {score}%
          </span>
        </div>
        <button className="btn btn-secondary" onClick={() => onViewDetail(match)}>
          <Eye size={16} />
          View Full Comparison
        </button>
      </div>

      <div className="match-side-by-side">
        <div className="person-summary-box">
          <h4>Missing Person Report</h4>
          <div className="person-summary-content">
            <img 
              src={missing.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${missing._id}`} 
              alt={missing.name} 
              className="person-summary-avatar"
            />
            <div>
              <strong>{missing.name || 'Unknown'}</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {missing.age} yrs • {missing.gender} • {missing.height} cm
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                📍 {missing.location_name}
              </div>
            </div>
          </div>
        </div>

        <div className="person-summary-box">
          <h4>Unidentified Record</h4>
          <div className="person-summary-content">
            <img 
              src={unidentified.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${unidentified._id}`} 
              alt="Unidentified" 
              className="person-summary-avatar"
            />
            <div>
              <strong>Unidentified Record</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ~{unidentified.estimated_age} yrs (Est.) • {unidentified.gender} • {unidentified.height} cm
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                📍 {unidentified.location_name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Key Matching Factors ({match.matching_attributes?.length || 0})
        </h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {match.matching_attributes?.slice(0, 4).map((attr, idx) => (
            <span key={idx} className="badge badge-green">
              <CheckCircle2 size={13} /> {attr}
            </span>
          ))}
          {(match.matching_attributes?.length || 0) > 4 && (
            <span className="badge badge-gray">+{match.matching_attributes.length - 4} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
