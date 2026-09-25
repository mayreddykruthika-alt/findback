import React, { useState } from 'react';
import PersonCard from '../components/PersonCard';
import { Search, Plus, Users } from 'lucide-react';

export default function MissingPersonsPage({ 
  missingPersons, 
  onSearch, 
  onOpenMissingForm, 
  onFindMatches, 
  onDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Missing Persons Directory</h1>
          <p>Browse and search active missing person reports</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenMissingForm}>
          <Plus size={16} /> Report Missing Person
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by name, marks, location, or clothing..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Showing <strong>{missingPersons.length}</strong> reports
        </div>
      </div>

      {missingPersons.length > 0 ? (
        <div className="cards-grid">
          {missingPersons.map(person => (
            <PersonCard 
              key={person._id} 
              person={person} 
              type="missing" 
              onFindMatches={onFindMatches}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Users size={40} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
          <h3>No Missing Persons Found</h3>
          <p>Try clearing your search query or submit a new missing person report.</p>
        </div>
      )}
    </div>
  );
}
