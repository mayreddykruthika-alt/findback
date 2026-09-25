import React from 'react';
import StatCard from '../components/StatCard';
import PersonCard from '../components/PersonCard';
import { Users, UserX, GitCompare, Database, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardPage({ 
  summary, 
  onNavigate, 
  onOpenMissingForm, 
  onOpenUnidentifiedForm,
  onFindMatches,
  onDelete
}) {
  if (!summary) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard data...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>System Overview</h1>
          <p>Real-time missing person case database & automated matching statistics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenMissingForm}>
            <Plus size={16} /> Report Missing Person
          </button>
          <button className="btn btn-emerald" onClick={onOpenUnidentifiedForm}>
            <Plus size={16} /> Record Unidentified Person
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard 
          label="Total Missing Reports" 
          value={summary.total_missing} 
          icon={Users} 
          color="var(--primary-blue)"
          bgColor="var(--bg-accent-blue)"
        />
        <StatCard 
          label="Unidentified Records" 
          value={summary.total_unidentified} 
          icon={UserX} 
          color="var(--emerald-green)"
          bgColor="var(--bg-accent-green)"
        />
        <StatCard 
          label="Potential Matches Found" 
          value={summary.total_potential_matches} 
          icon={GitCompare} 
          color="var(--amber-warning)"
          bgColor="var(--bg-accent-amber)"
        />
        <StatCard 
          label="MongoDB Database" 
          value="Connected" 
          icon={ShieldCheck} 
          color="#16a34a"
          bgColor="#dcfce7"
        />
      </div>

      {/* Recent Missing Reports */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Missing Reports</h2>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.85rem' }} 
            onClick={() => onNavigate('missing')}
          >
            View All ({summary.total_missing}) <ArrowRight size={14} />
          </button>
        </div>

        {summary.recent_missing?.length > 0 ? (
          <div className="cards-grid">
            {summary.recent_missing.slice(0, 3).map(person => (
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
            <h3>No Missing Person Reports</h3>
            <p>Click "Report Missing Person" to add a new report to the database.</p>
          </div>
        )}
      </div>

      {/* Recent Unidentified Records */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Unidentified Records</h2>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.85rem' }} 
            onClick={() => onNavigate('unidentified')}
          >
            View All ({summary.total_unidentified}) <ArrowRight size={14} />
          </button>
        </div>

        {summary.recent_unidentified?.length > 0 ? (
          <div className="cards-grid">
            {summary.recent_unidentified.slice(0, 3).map(person => (
              <PersonCard 
                key={person._id} 
                person={person} 
                type="unidentified" 
                onFindMatches={onFindMatches}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Unidentified Records</h3>
            <p>Click "Record Unidentified Person" to submit a record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
