import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import MissingPersonsPage from './pages/MissingPersonsPage';
import UnidentifiedPersonsPage from './pages/UnidentifiedPersonsPage';
import MatchesPage from './pages/MatchesPage';

import MissingFormModal from './components/MissingFormModal';
import UnidentifiedFormModal from './components/UnidentifiedFormModal';
import MatchDetailModal from './components/MatchDetailModal';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [missingPersons, setMissingPersons] = useState([]);
  const [unidentifiedPersons, setUnidentifiedPersons] = useState([]);
  const [matches, setMatches] = useState([]);
  
  const [isSeeding, setIsSeeding] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showUnidentifiedModal, setShowUnidentifiedModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Initial Data Fetch
  const refreshAllData = async () => {
    try {
      const [sumRes, missRes, unIdRes, matchRes] = await Promise.all([
        api.getDashboard(),
        api.getMissingPersons(),
        api.getUnidentifiedPersons(),
        api.getAllMatches()
      ]);
      setSummary(sumRes);
      setMissingPersons(missRes);
      setUnidentifiedPersons(unIdRes);
      setMatches(matchRes);
    } catch (err) {
      console.error("Error loading application data:", err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handlers
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await api.seedDatabase();
      await refreshAllData();
      alert("Sample database seeded successfully with realistic reports & matches!");
    } catch (err) {
      console.error("Error seeding database:", err);
      alert("Failed to seed database.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSearchMissing = async (term) => {
    try {
      const res = await api.getMissingPersons(term);
      setMissingPersons(res);
    } catch (err) {
      console.error("Error searching missing persons:", err);
    }
  };

  const handleSearchUnidentified = async (term) => {
    try {
      const res = await api.getUnidentifiedPersons(term);
      setUnidentifiedPersons(res);
    } catch (err) {
      console.error("Error searching unidentified persons:", err);
    }
  };

  const handleCreateMissing = async (formData) => {
    try {
      await api.createMissingPerson(formData);
      setShowMissingModal(false);
      await refreshAllData();
      setActiveTab('missing');
    } catch (err) {
      console.error("Error creating missing person:", err);
      alert("Failed to create missing person report.");
    }
  };

  const handleCreateUnidentified = async (formData) => {
    try {
      await api.createUnidentifiedPerson(formData);
      setShowUnidentifiedModal(false);
      await refreshAllData();
      setActiveTab('unidentified');
    } catch (err) {
      console.error("Error creating unidentified person:", err);
      alert("Failed to create unidentified record.");
    }
  };

  const handleDeleteRecord = async (id, isMissing) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      if (isMissing) {
        await api.deleteMissingPerson(id);
      } else {
        await api.deleteUnidentifiedPerson(id);
      }
      await refreshAllData();
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  };

  const handleFindMatches = async (missingId) => {
    try {
      const res = await api.findMatchesForMissing(missingId);
      await refreshAllData();
      setActiveTab('matches');
      if (res.matches && res.matches.length > 0) {
        setSelectedMatch(res.matches[0]);
      }
    } catch (err) {
      console.error("Error finding matches:", err);
      alert("Failed to run match algorithm.");
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSeed={handleSeed}
        isSeeding={isSeeding}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardPage 
            summary={summary} 
            onNavigate={setActiveTab}
            onOpenMissingForm={() => setShowMissingModal(true)}
            onOpenUnidentifiedForm={() => setShowUnidentifiedModal(true)}
            onFindMatches={handleFindMatches}
            onDelete={handleDeleteRecord}
          />
        )}

        {activeTab === 'missing' && (
          <MissingPersonsPage 
            missingPersons={missingPersons}
            onSearch={handleSearchMissing}
            onOpenMissingForm={() => setShowMissingModal(true)}
            onFindMatches={handleFindMatches}
            onDelete={handleDeleteRecord}
          />
        )}

        {activeTab === 'unidentified' && (
          <UnidentifiedPersonsPage 
            unidentifiedPersons={unidentifiedPersons}
            onSearch={handleSearchUnidentified}
            onOpenUnidentifiedForm={() => setShowUnidentifiedModal(true)}
            onDelete={handleDeleteRecord}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesPage 
            matches={matches}
            onViewMatchDetail={(match) => setSelectedMatch(match)}
          />
        )}
      </main>

      {/* Modals */}
      {showMissingModal && (
        <MissingFormModal 
          onClose={() => setShowMissingModal(false)}
          onSubmit={handleCreateMissing}
        />
      )}

      {showUnidentifiedModal && (
        <UnidentifiedFormModal 
          onClose={() => setShowUnidentifiedModal(false)}
          onSubmit={handleCreateUnidentified}
        />
      )}

      {selectedMatch && (
        <MatchDetailModal 
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
