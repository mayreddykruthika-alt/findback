import React from 'react';
import { Search, Users, UserX, GitCompare, Database, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onSeed, isSeeding }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand-logo">
          <div className="brand-icon">
            <ShieldAlert size={20} />
          </div>
          <span>FindBack</span>
        </div>

        <ul className="nav-links">
          <li>
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Search size={17} />
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'missing' ? 'active' : ''}`}
              onClick={() => setActiveTab('missing')}
            >
              <Users size={17} />
              Missing Persons
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'unidentified' ? 'active' : ''}`}
              onClick={() => setActiveTab('unidentified')}
            >
              <UserX size={17} />
              Unidentified Persons
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <GitCompare size={17} />
              Matches
            </button>
          </li>
        </ul>

        <button 
          className="btn-seed"
          onClick={onSeed} 
          disabled={isSeeding}
          title="Reset database with realistic sample cases"
        >
          <Database size={15} />
          {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
        </button>
      </div>
    </nav>
  );
}
