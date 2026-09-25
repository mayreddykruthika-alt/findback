import React, { useState } from 'react';
import PersonCard from '../components/PersonCard';
import { Search, Plus, UserX } from 'lucide-react';

export default function UnidentifiedPersonsPage({ 
  unidentifiedPersons, 
  onSearch, 
  onOpenUnidentifiedForm, 
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
          <h1>Unidentified Person Records</h1>
          <p>Database of found/unidentified individuals awaiting identification</p>
        </div>
        <button className="btn btn-emerald" onClick={onOpenUnidentifiedForm}>
          <Plus size={16} /> Record Unidentified Person
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by marks, location, or clothing..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Showing <strong>{unidentifiedPersons.length}</strong> records
        </div>
      </div>

      {unidentifiedPersons.length > 0 ? (
        <div className="cards-grid">
          {unidentifiedPersons.map(person => (
            <PersonCard 
              key={person._id} 
              person={person} 
              type="unidentified" 
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <UserX size={40} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
          <h3>No Unidentified Records Found</h3>
          <p>Try clearing your search query or submit a new unidentified person record.</p>
        </div>
      )}
    </div>
  );
}
