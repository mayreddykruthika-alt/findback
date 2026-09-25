import React from 'react';
import { MapPin, Calendar, Ruler, Sparkles, Shirt, Eye, GitCompare, Trash2 } from 'lucide-react';

export default function PersonCard({ person, type, onFindMatches, onDelete }) {
  const isMissing = type === 'missing';
  const name = isMissing ? person.name : 'Unidentified Person';
  const ageDisplay = isMissing ? `${person.age} yrs` : `~${person.estimated_age} yrs (Est.)`;
  const dateDisplay = isMissing ? `Last seen: ${person.last_seen_date}` : `Found: ${person.found_date}`;
  const locationDisplay = person.location_name || (person.location ? person.location.name : 'Unknown');

  return (
    <div className="card person-card">
      <div className="person-card-header">
        <img 
          src={person.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${person._id}`} 
          alt={name} 
          className="person-avatar" 
        />
        <div className="person-title">
          <h3>{name}</h3>
          <div className="person-meta-tags">
            <span className="badge badge-blue">{person.gender}</span>
            <span className="badge badge-gray">{ageDisplay}</span>
            <span className="badge badge-gray">{person.height} cm</span>
          </div>
        </div>
      </div>

      <div className="person-details-list">
        <div className="detail-row">
          <MapPin className="detail-icon" />
          <span><strong>Location:</strong> {locationDisplay}</span>
        </div>
        <div className="detail-row">
          <Calendar className="detail-icon" />
          <span>{dateDisplay}</span>
        </div>
        <div className="detail-row">
          <Eye className="detail-icon" />
          <span><strong>Traits:</strong> {person.hair_color} hair, {person.eye_color} eyes</span>
        </div>
        <div className="detail-row">
          <Sparkles className="detail-icon" />
          <span><strong>Marks:</strong> {person.identifying_marks || 'None reported'}</span>
        </div>
        <div className="detail-row">
          <Shirt className="detail-icon" />
          <span><strong>Clothing:</strong> {person.clothing_description || 'N/A'}</span>
        </div>
      </div>

      <div className="person-card-actions">
        {isMissing && (
          <button 
            className="btn btn-emerald" 
            onClick={() => onFindMatches(person._id)}
          >
            <GitCompare size={16} />
            Find Potential Matches
          </button>
        )}
        <button 
          className="btn-danger-text" 
          onClick={() => onDelete(person._id, isMissing)}
          title="Delete record"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
