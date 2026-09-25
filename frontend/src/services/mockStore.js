import { computeSimilarity } from './matcherEngine';

function makeAvatarSvg(name, bgColor, textColor = "#ffffff") {
  const parts = name ? name.trim().split(/\s+/) : [];
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bgColor}" rx="16"/>
    <circle cx="100" cy="75" r="35" fill="${textColor}" opacity="0.3"/>
    <path d="M40,165 C40,120 70,110 100,110 C130,110 160,120 160,165 Z" fill="${textColor}" opacity="0.3"/>
    <text x="100" y="105" fill="${textColor}" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="bold" text-anchor="middle">${initials}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const DEFAULT_MISSING = [
  {
    _id: "m_1",
    name: "Alexander Morgan",
    age: 28,
    gender: "Male",
    height: 178,
    hair_color: "Brown",
    eye_color: "Blue",
    identifying_marks: "Small butterfly tattoo on left wrist, surgical scar on right knee",
    location_name: "Central Park, New York, NY",
    latitude: 40.785091,
    longitude: -73.968285,
    last_seen_date: "2026-09-10",
    clothing_description: "Navy blue hoodie, dark grey denim jeans, black Nike sneakers",
    photo_url: makeAvatarSvg("Alexander Morgan", "#2563eb"),
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    _id: "m_2",
    name: "Sophia Chen",
    age: 24,
    gender: "Female",
    height: 162,
    hair_color: "Black",
    eye_color: "Brown",
    identifying_marks: "Small birthmark behind left ear, silver nose ring",
    location_name: "Downtown Station, Chicago, IL",
    latitude: 41.878114,
    longitude: -87.629798,
    last_seen_date: "2026-09-12",
    clothing_description: "Beige trench coat, white wool sweater, brown leather boots",
    photo_url: makeAvatarSvg("Sophia Chen", "#ec4899"),
    created_at: new Date(Date.now() - 13 * 86400000).toISOString()
  },
  {
    _id: "m_3",
    name: "Marcus Vance",
    age: 42,
    gender: "Male",
    height: 185,
    hair_color: "Black",
    eye_color: "Brown",
    identifying_marks: "Anchor tattoo on left forearm, mole on chin",
    location_name: "Santa Monica Pier, Los Angeles, CA",
    latitude: 34.009985,
    longitude: -118.496475,
    last_seen_date: "2026-09-15",
    clothing_description: "Red plaid flannel shirt, blue jeans, brown work boots",
    photo_url: makeAvatarSvg("Marcus Vance", "#059669"),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: "m_4",
    name: "Elena Rostova",
    age: 31,
    gender: "Female",
    height: 170,
    hair_color: "Blonde",
    eye_color: "Green",
    identifying_marks: "Linear scar across left eyebrow, floral tattoo on shoulder",
    location_name: "Ocean Drive, Miami, FL",
    latitude: 25.780604,
    longitude: -80.130043,
    last_seen_date: "2026-09-18",
    clothing_description: "Yellow summer dress, white sandals, black sunglasses",
    photo_url: makeAvatarSvg("Elena Rostova", "#d97706"),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: "m_5",
    name: "David Miller",
    age: 65,
    gender: "Male",
    height: 173,
    hair_color: "Grey",
    eye_color: "Hazel",
    identifying_marks: "Wears prescription glasses, pacemaker scar on chest",
    location_name: "Market Street, San Francisco, CA",
    latitude: 37.789721,
    longitude: -122.401142,
    last_seen_date: "2026-09-05",
    clothing_description: "Green cardigan sweater, khaki trousers, walking shoes",
    photo_url: makeAvatarSvg("David Miller", "#4b5563"),
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const DEFAULT_UNIDENTIFIED = [
  {
    _id: "u_1",
    estimated_age: 29,
    gender: "Male",
    height: 177,
    hair_color: "Brown",
    eye_color: "Blue",
    identifying_marks: "Butterfly tattoo on left wrist, knee scar",
    location_name: "East River Greenway, New York, NY",
    latitude: 40.792500,
    longitude: -73.935000,
    found_date: "2026-09-12",
    clothing_description: "Dark blue hoodie, grey denim jeans, black sneakers",
    photo_url: makeAvatarSvg("Unidentified Male NY", "#1d4ed8"),
    created_at: new Date(Date.now() - 13 * 86400000).toISOString()
  },
  {
    _id: "u_2",
    estimated_age: 25,
    gender: "Female",
    height: 163,
    hair_color: "Black",
    eye_color: "Brown",
    identifying_marks: "Birthmark near ear, nose piercing",
    location_name: "Millennium Park Area, Chicago, IL",
    latitude: 41.882700,
    longitude: -87.623300,
    found_date: "2026-09-14",
    clothing_description: "Beige coat, white knit sweater, leather boots",
    photo_url: makeAvatarSvg("Unidentified Female CHI", "#db2777"),
    created_at: new Date(Date.now() - 11 * 86400000).toISOString()
  },
  {
    _id: "u_3",
    estimated_age: 40,
    gender: "Male",
    height: 184,
    hair_color: "Black",
    eye_color: "Brown",
    identifying_marks: "Forearm anchor tattoo",
    location_name: "Venice Beach Promenade, Los Angeles, CA",
    latitude: 33.985000,
    longitude: -118.469000,
    found_date: "2026-09-17",
    clothing_description: "Red plaid shirt, blue denim pants",
    photo_url: makeAvatarSvg("Unidentified Male LA", "#047857"),
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: "u_4",
    estimated_age: 30,
    gender: "Female",
    height: 169,
    hair_color: "Blonde",
    eye_color: "Green",
    identifying_marks: "Scar near left eye, shoulder tattoo",
    location_name: "Biscayne Bay Park, Miami, FL",
    latitude: 25.774000,
    longitude: -80.185000,
    found_date: "2026-09-20",
    clothing_description: "Yellow floral dress, white sandals",
    photo_url: makeAvatarSvg("Unidentified Female MIA", "#b45309"),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const STORAGE_KEYS = {
  MISSING: 'findback_missing_persons',
  UNIDENTIFIED: 'findback_unidentified_persons',
  MATCHES: 'findback_matches'
};

function generateMatches(missingList, unidentifiedList) {
  const matches = [];
  for (const m of missingList) {
    for (const u of unidentifiedList) {
      const res = computeSimilarity(m, u);
      if (res.match_score >= 30.0) {
        matches.push({
          _id: `match_${m._id}_${u._id}`,
          missing_person_id: m._id,
          unidentified_person_id: u._id,
          match_score: res.match_score,
          classification: 'Potential Match',
          matching_attributes: res.matching_attributes,
          different_attributes: res.different_attributes,
          breakdown: res.breakdown,
          created_at: new Date().toISOString()
        });
      }
    }
  }
  return matches.sort((a, b) => b.match_score - a.match_score);
}

function loadStorage(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function saveStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

export const mockStore = {
  getMissingPersons: (search = '') => {
    let list = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.identifying_marks && p.identifying_marks.toLowerCase().includes(q)) ||
        (p.location_name && p.location_name.toLowerCase().includes(q)) ||
        (p.clothing_description && p.clothing_description.toLowerCase().includes(q))
      );
    }
    return list;
  },

  createMissingPerson: (payload) => {
    const list = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    const newDoc = {
      ...payload,
      _id: `m_${Date.now()}`,
      photo_url: payload.photo_url || makeAvatarSvg(payload.name || "Missing Person", "#2563eb"),
      created_at: new Date().toISOString()
    };
    list.unshift(newDoc);
    saveStorage(STORAGE_KEYS.MISSING, list);

    // Update matches
    const uList = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    const matches = loadStorage(STORAGE_KEYS.MATCHES, []);
    for (const u of uList) {
      const res = computeSimilarity(newDoc, u);
      if (res.match_score >= 30.0) {
        matches.push({
          _id: `match_${newDoc._id}_${u._id}`,
          missing_person_id: newDoc._id,
          unidentified_person_id: u._id,
          match_score: res.match_score,
          classification: 'Potential Match',
          matching_attributes: res.matching_attributes,
          different_attributes: res.different_attributes,
          breakdown: res.breakdown,
          created_at: new Date().toISOString()
        });
      }
    }
    saveStorage(STORAGE_KEYS.MATCHES, matches);
    return newDoc;
  },

  deleteMissingPerson: (id) => {
    let list = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    list = list.filter((p) => p._id !== id);
    saveStorage(STORAGE_KEYS.MISSING, list);

    let matches = loadStorage(STORAGE_KEYS.MATCHES, []);
    matches = matches.filter((m) => m.missing_person_id !== id);
    saveStorage(STORAGE_KEYS.MATCHES, matches);
    return { message: "Record deleted successfully" };
  },

  getUnidentifiedPersons: (search = '') => {
    let list = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) =>
        (p.identifying_marks && p.identifying_marks.toLowerCase().includes(q)) ||
        (p.location_name && p.location_name.toLowerCase().includes(q)) ||
        (p.clothing_description && p.clothing_description.toLowerCase().includes(q))
      );
    }
    return list;
  },

  createUnidentifiedPerson: (payload) => {
    const list = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    const newDoc = {
      ...payload,
      _id: `u_${Date.now()}`,
      photo_url: payload.photo_url || makeAvatarSvg("Unidentified Case", "#047857"),
      created_at: new Date().toISOString()
    };
    list.unshift(newDoc);
    saveStorage(STORAGE_KEYS.UNIDENTIFIED, list);

    // Update matches
    const mList = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    const matches = loadStorage(STORAGE_KEYS.MATCHES, []);
    for (const m of mList) {
      const res = computeSimilarity(m, newDoc);
      if (res.match_score >= 30.0) {
        matches.push({
          _id: `match_${m._id}_${newDoc._id}`,
          missing_person_id: m._id,
          unidentified_person_id: newDoc._id,
          match_score: res.match_score,
          classification: 'Potential Match',
          matching_attributes: res.matching_attributes,
          different_attributes: res.different_attributes,
          breakdown: res.breakdown,
          created_at: new Date().toISOString()
        });
      }
    }
    saveStorage(STORAGE_KEYS.MATCHES, matches);
    return newDoc;
  },

  deleteUnidentifiedPerson: (id) => {
    let list = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    list = list.filter((p) => p._id !== id);
    saveStorage(STORAGE_KEYS.UNIDENTIFIED, list);

    let matches = loadStorage(STORAGE_KEYS.MATCHES, []);
    matches = matches.filter((m) => m.unidentified_person_id !== id);
    saveStorage(STORAGE_KEYS.MATCHES, matches);
    return { message: "Record deleted successfully" };
  },

  findMatchesForMissing: (missingId) => {
    const mList = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    const uList = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    const missingDoc = mList.find((p) => p._id === missingId);
    if (!missingDoc) throw new Error("Missing person record not found");

    const results = [];
    const storedMatches = loadStorage(STORAGE_KEYS.MATCHES, []);

    for (const u of uList) {
      const sim = computeSimilarity(missingDoc, u);
      const matchPayload = {
        _id: `match_${missingId}_${u._id}`,
        missing_person_id: missingId,
        unidentified_person_id: u._id,
        match_score: sim.match_score,
        classification: 'Potential Match',
        matching_attributes: sim.matching_attributes,
        different_attributes: sim.different_attributes,
        breakdown: sim.breakdown,
        created_at: new Date().toISOString(),
        missing_person: { ...missingDoc },
        unidentified_person: { ...u }
      };

      const existingIdx = storedMatches.findIndex(
        (m) => m.missing_person_id === missingId && m.unidentified_person_id === u._id
      );
      if (existingIdx >= 0) {
        storedMatches[existingIdx] = matchPayload;
      } else {
        storedMatches.push(matchPayload);
      }

      results.push(matchPayload);
    }

    saveStorage(STORAGE_KEYS.MATCHES, storedMatches);
    results.sort((a, b) => b.match_score - a.match_score);

    return {
      missing_person_id: missingId,
      total_compared: uList.length,
      matches: results
    };
  },

  getAllMatches: (minScore = 0.0) => {
    const mList = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    const uList = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    let matches = loadStorage(STORAGE_KEYS.MATCHES, null);

    if (!matches || matches.length === 0) {
      matches = generateMatches(mList, uList);
      saveStorage(STORAGE_KEYS.MATCHES, matches);
    }

    const populated = [];
    for (const m of matches) {
      if (m.match_score >= minScore) {
        const mDoc = mList.find((p) => p._id === m.missing_person_id);
        const uDoc = uList.find((p) => p._id === m.unidentified_person_id);
        if (mDoc && uDoc) {
          populated.push({
            ...m,
            missing_person: mDoc,
            unidentified_person: uDoc
          });
        }
      }
    }
    return populated.sort((a, b) => b.match_score - a.match_score);
  },

  getMatchDetail: (matchId) => {
    const all = mockStore.getAllMatches();
    const item = all.find((m) => m._id === matchId);
    if (!item) throw new Error("Match not found");
    return item;
  },

  getDashboard: () => {
    const mList = loadStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    const uList = loadStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    const allMatches = mockStore.getAllMatches();
    const potentialCount = allMatches.filter((m) => m.match_score >= 50.0).length;

    return {
      total_missing: mList.length,
      total_unidentified: uList.length,
      total_potential_matches: potentialCount,
      recent_missing: mList.slice(0, 5),
      recent_unidentified: uList.slice(0, 5)
    };
  },

  seedDatabase: () => {
    saveStorage(STORAGE_KEYS.MISSING, DEFAULT_MISSING);
    saveStorage(STORAGE_KEYS.UNIDENTIFIED, DEFAULT_UNIDENTIFIED);
    const matches = generateMatches(DEFAULT_MISSING, DEFAULT_UNIDENTIFIED);
    saveStorage(STORAGE_KEYS.MATCHES, matches);
    return {
      status: "success",
      missing_count: DEFAULT_MISSING.length,
      unidentified_count: DEFAULT_UNIDENTIFIED.length,
      matches_generated: matches.length
    };
  }
};
