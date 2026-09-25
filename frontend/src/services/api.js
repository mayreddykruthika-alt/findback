import axios from 'axios';
import { mockStore } from './mockStore';

const isStaticHosting = typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || window.location.protocol === 'file:');

const API_BASE = '/api';
const client = axios.create({
  timeout: 1800
});

export const api = {
  // Dashboard
  getDashboard: async () => {
    if (isStaticHosting) return mockStore.getDashboard();
    try {
      const res = await client.get(`${API_BASE}/dashboard`);
      return res.data;
    } catch {
      return mockStore.getDashboard();
    }
  },

  // Missing Persons
  getMissingPersons: async (search = '') => {
    if (isStaticHosting) return mockStore.getMissingPersons(search);
    try {
      const res = await client.get(`${API_BASE}/missing-persons`, {
        params: search ? { search } : {}
      });
      return res.data;
    } catch {
      return mockStore.getMissingPersons(search);
    }
  },

  createMissingPerson: async (payload) => {
    if (isStaticHosting) return mockStore.createMissingPerson(payload);
    try {
      const res = await client.post(`${API_BASE}/missing-persons`, payload);
      return res.data;
    } catch {
      return mockStore.createMissingPerson(payload);
    }
  },

  deleteMissingPerson: async (id) => {
    if (isStaticHosting) return mockStore.deleteMissingPerson(id);
    try {
      const res = await client.delete(`${API_BASE}/missing-persons/${id}`);
      return res.data;
    } catch {
      return mockStore.deleteMissingPerson(id);
    }
  },

  // Unidentified Persons
  getUnidentifiedPersons: async (search = '') => {
    if (isStaticHosting) return mockStore.getUnidentifiedPersons(search);
    try {
      const res = await client.get(`${API_BASE}/unidentified-persons`, {
        params: search ? { search } : {}
      });
      return res.data;
    } catch {
      return mockStore.getUnidentifiedPersons(search);
    }
  },

  createUnidentifiedPerson: async (payload) => {
    if (isStaticHosting) return mockStore.createUnidentifiedPerson(payload);
    try {
      const res = await client.post(`${API_BASE}/unidentified-persons`, payload);
      return res.data;
    } catch {
      return mockStore.createUnidentifiedPerson(payload);
    }
  },

  deleteUnidentifiedPerson: async (id) => {
    if (isStaticHosting) return mockStore.deleteUnidentifiedPerson(id);
    try {
      const res = await client.delete(`${API_BASE}/unidentified-persons/${id}`);
      return res.data;
    } catch {
      return mockStore.deleteUnidentifiedPerson(id);
    }
  },

  // Intelligent Matching
  findMatchesForMissing: async (missingId) => {
    if (isStaticHosting) return mockStore.findMatchesForMissing(missingId);
    try {
      const res = await client.post(`${API_BASE}/matching/find/${missingId}`);
      return res.data;
    } catch {
      return mockStore.findMatchesForMissing(missingId);
    }
  },

  getAllMatches: async () => {
    if (isStaticHosting) return mockStore.getAllMatches();
    try {
      const res = await client.get(`${API_BASE}/matching/all`);
      return res.data;
    } catch {
      return mockStore.getAllMatches();
    }
  },

  getMatchDetail: async (matchId) => {
    if (isStaticHosting) return mockStore.getMatchDetail(matchId);
    try {
      const res = await client.get(`${API_BASE}/matching/${matchId}`);
      return res.data;
    } catch {
      return mockStore.getMatchDetail(matchId);
    }
  },

  // Database Seed
  seedDatabase: async () => {
    if (isStaticHosting) return mockStore.seedDatabase();
    try {
      const res = await client.post(`${API_BASE}/seed`);
      return res.data;
    } catch {
      return mockStore.seedDatabase();
    }
  }
};
