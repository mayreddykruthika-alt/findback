import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, MapPin, Calendar, Sparkles, Shirt, Eye, User } from 'lucide-react';

export default function MatchDetailModal({ match, onClose }) {
  if (!match) return null;

  const score = match.match_score;
  const missing = match.missing_person || {};
  const unidentified = match.unidentified_person || {};
  const breakdown = match.breakdown || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>
              <ShieldAlert size={16} /> Potential Match
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
              {score}% Similarity Score
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="disclaimer-banner">
            <AlertTriangle size={20} flexShrink={0} />
            <div>
              <strong>Human Verification Required:</strong> This automated system generates potential match candidates based on multi-attribute weighted algorithms. It serves solely to assist investigative workflow and is <u>never a confirmed match</u>.
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>
            Side-by-Side Record Comparison
          </h3>

          <div className="match-side-by-side" style={{ marginBottom: '1.5rem' }}>
            {/* Missing Person Profile */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img 
                  src={missing.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${missing._id}`} 
                  alt={missing.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '8px' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-blue)' }}>{missing.name}</h4>
                  <span className="badge badge-blue">Missing Person Report</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <div><strong>Age:</strong> {missing.age} years old</div>
                <div><strong>Gender:</strong> {missing.gender}</div>
                <div><strong>Height:</strong> {missing.height} cm</div>
                <div><strong>Hair / Eye:</strong> {missing.hair_color} hair, {missing.eye_color} eyes</div>
                <div><strong>Location:</strong> 📍 {missing.location_name}</div>
                <div><strong>Last Seen:</strong> 📅 {missing.last_seen_date}</div>
                <div><strong>Marks:</strong> ✨ {missing.identifying_marks || 'None'}</div>
                <div><strong>Clothing:</strong> 👕 {missing.clothing_description || 'None'}</div>
              </div>
            </div>

            {/* Unidentified Person Profile */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img 
                  src={unidentified.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${unidentified._id}`} 
                  alt="Unidentified" 
                  style={{ width: '56px', height: '56px', borderRadius: '8px' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--emerald-green)' }}>Unidentified Record</h4>
                  <span className="badge badge-green">Unidentified Record</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <div><strong>Est. Age:</strong> ~{unidentified.estimated_age} years old</div>
                <div><strong>Gender:</strong> {unidentified.gender}</div>
                <div><strong>Height:</strong> {unidentified.height} cm</div>
                <div><strong>Hair / Eye:</strong> {unidentified.hair_color} hair, {unidentified.eye_color} eyes</div>
                <div><strong>Location:</strong> 📍 {unidentified.location_name}</div>
                <div><strong>Found Date:</strong> 📅 {unidentified.found_date}</div>
                <div><strong>Marks:</strong> ✨ {unidentified.identifying_marks || 'None'}</div>
                <div><strong>Clothing:</strong> 👕 {unidentified.clothing_description || 'None'}</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Weighted Attribute Breakdown
          </h3>

          <div className="breakdown-list">
            {breakdown.map((item, idx) => (
              <div key={idx} className={`breakdown-item ${item.status}`}>
                <div>
                  <div className="breakdown-category">
                    {item.status === 'MATCH' && <CheckCircle2 size={16} color="var(--emerald-green)" />}
                    {item.status === 'PARTIAL' && <AlertTriangle size={16} color="var(--amber-warning)" />}
                    {item.status === 'DIFFERENT' && <X size={16} color="var(--text-muted)" />}
                    <span>{item.category}</span>
                  </div>
                  <div className="breakdown-desc">{item.description}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {item.score_achieved} / {item.weight_percentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({Math.round((item.score_achieved / item.weight_percentage) * 100)}% match)
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '700' }}>
                ✓ Matching Attributes ({match.matching_attributes?.length || 0})
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {match.matching_attributes?.map((attr, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{attr}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--amber-warning)', marginBottom: '0.5rem', fontWeight: '700' }}>
                ⚠ Differences & Missing Info ({match.different_attributes?.length || 0})
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {match.different_attributes?.map((attr, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{attr}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
