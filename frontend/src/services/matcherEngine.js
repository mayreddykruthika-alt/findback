// Client-side Intelligent Matching Algorithm (JavaScript port of backend/app/matcher.py)

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth radius in km
  const toRad = (x) => (x * Math.PI) / 180.0;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function extractKeywords(text) {
  if (!text) return new Set();
  const words = text.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'of', 'and', 'or', 'with', 'wears',
    'wearing', 'has', 'was'
  ]);
  return new Set(words.filter((w) => !stopWords.has(w) && w.length > 1));
}

export function computeSimilarity(missing, unidentified) {
  const matchingAttributes = [];
  const differentAttributes = [];
  const breakdown = [];
  let totalScore = 0.0;

  // 1. AGE (15%)
  const mAge = missing.age || 0;
  const uAge = unidentified.estimated_age || 0;
  const ageDiff = Math.abs(mAge - uAge);
  let ageScore = 0.0;
  let ageStatus = 'DIFFERENT';

  if (ageDiff === 0) {
    ageScore = 15.0;
    ageStatus = 'MATCH';
    matchingAttributes.push(`Age Match: Exactly ${mAge} yrs old`);
  } else if (ageDiff <= 1) {
    ageScore = 13.5;
    ageStatus = 'PARTIAL';
    matchingAttributes.push(`Age Proximity: ${mAge} yrs vs estimated ${uAge} yrs (±1 yr)`);
  } else if (ageDiff <= 3) {
    ageScore = 10.5;
    ageStatus = 'PARTIAL';
    matchingAttributes.push(`Age Proximity: ${mAge} yrs vs estimated ${uAge} yrs (±${ageDiff} yrs)`);
  } else if (ageDiff <= 5) {
    ageScore = 6.0;
    ageStatus = 'PARTIAL';
    differentAttributes.push(`Age Difference: ${mAge} yrs vs estimated ${uAge} yrs (±${ageDiff} yrs)`);
  } else if (ageDiff <= 10) {
    ageScore = 3.0;
    ageStatus = 'DIFFERENT';
    differentAttributes.push(`Significant Age Gap: ${mAge} yrs vs estimated ${uAge} yrs`);
  } else {
    ageScore = 0.0;
    ageStatus = 'DIFFERENT';
    differentAttributes.push(`Large Age Mismatch: ${mAge} yrs vs estimated ${uAge} yrs`);
  }

  totalScore += ageScore;
  breakdown.push({
    category: 'Age Similarity',
    weight_percentage: 15.0,
    score_achieved: Math.round(ageScore * 10) / 10,
    status: ageStatus,
    description: `Missing: ${mAge} yrs | Unidentified: ~${uAge} yrs (Diff: ${ageDiff} yrs)`
  });

  // 2. LOCATION (20%)
  const mLat = missing.latitude || 0.0;
  const mLon = missing.longitude || 0.0;
  const uLat = unidentified.latitude || 0.0;
  const uLon = unidentified.longitude || 0.0;

  const distKm = haversineDistance(mLat, mLon, uLat, uLon);
  const mLocName = missing.location_name || 'Unknown';
  const uLocName = unidentified.location_name || 'Unknown';
  let locScore = 0.0;
  let locStatus = 'DIFFERENT';

  if (distKm <= 5.0) {
    locScore = 20.0;
    locStatus = 'MATCH';
    matchingAttributes.push(`Geospatial Proximity: ${distKm.toFixed(1)} km apart (${mLocName} & ${uLocName})`);
  } else if (distKm <= 25.0) {
    locScore = 16.0;
    locStatus = 'PARTIAL';
    matchingAttributes.push(`Nearby Area: ${distKm.toFixed(1)} km distance between reported locations`);
  } else if (distKm <= 75.0) {
    locScore = 12.0;
    locStatus = 'PARTIAL';
    matchingAttributes.push(`Same Region: ${distKm.toFixed(1)} km distance`);
  } else if (distKm <= 200.0) {
    locScore = 8.0;
    locStatus = 'PARTIAL';
    differentAttributes.push(`Location Distance: ${distKm.toFixed(1)} km separation`);
  } else if (distKm <= 500.0) {
    locScore = 4.0;
    locStatus = 'DIFFERENT';
    differentAttributes.push(`Far Location: ${distKm.toFixed(1)} km apart`);
  } else {
    locScore = 0.0;
    locStatus = 'DIFFERENT';
    differentAttributes.push(`Distant Location: ${distKm.toFixed(1)} km apart (${mLocName} vs ${uLocName})`);
  }

  totalScore += locScore;
  breakdown.push({
    category: 'Location Proximity',
    weight_percentage: 20.0,
    score_achieved: Math.round(locScore * 10) / 10,
    status: locStatus,
    description: `Distance: ${distKm.toFixed(1)} km between '${mLocName}' and '${uLocName}'`
  });

  // 3. HEIGHT (15%)
  const mH = missing.height || 0.0;
  const uH = unidentified.height || 0.0;
  const hDiff = Math.abs(mH - uH);
  let hScore = 0.0;
  let hStatus = 'DIFFERENT';

  if (hDiff === 0) {
    hScore = 15.0;
    hStatus = 'MATCH';
    matchingAttributes.push(`Height Match: Exactly ${Math.round(mH)} cm`);
  } else if (hDiff <= 2.0) {
    hScore = 13.5;
    hStatus = 'PARTIAL';
    matchingAttributes.push(`Height Match: ${Math.round(mH)} cm vs ${Math.round(uH)} cm (±${Math.round(hDiff)} cm)`);
  } else if (hDiff <= 5.0) {
    hScore = 10.5;
    hStatus = 'PARTIAL';
    matchingAttributes.push(`Height Close: ${Math.round(mH)} cm vs ${Math.round(uH)} cm (±${Math.round(hDiff)} cm)`);
  } else if (hDiff <= 10.0) {
    hScore = 6.0;
    hStatus = 'PARTIAL';
    differentAttributes.push(`Height Variance: ${Math.round(mH)} cm vs ${Math.round(uH)} cm (Diff: ${Math.round(hDiff)} cm)`);
  } else if (hDiff <= 15.0) {
    hScore = 3.0;
    hStatus = 'DIFFERENT';
    differentAttributes.push(`Height Difference: ${Math.round(mH)} cm vs ${Math.round(uH)} cm (Diff: ${Math.round(hDiff)} cm)`);
  } else {
    hScore = 0.0;
    hStatus = 'DIFFERENT';
    differentAttributes.push(`Significant Height Mismatch: ${Math.round(mH)} cm vs ${Math.round(uH)} cm`);
  }

  totalScore += hScore;
  breakdown.push({
    category: 'Height Similarity',
    weight_percentage: 15.0,
    score_achieved: Math.round(hScore * 10) / 10,
    status: hStatus,
    description: `Missing: ${Math.round(mH)} cm | Unidentified: ${Math.round(uH)} cm (Diff: ${Math.round(hDiff)} cm)`
  });

  // 4. HAIR & EYE CHARACTERISTICS (10%)
  const mHair = (missing.hair_color || '').toLowerCase().trim();
  const uHair = (unidentified.hair_color || '').toLowerCase().trim();
  const mEye = (missing.eye_color || '').toLowerCase().trim();
  const uEye = (unidentified.eye_color || '').toLowerCase().trim();

  const hairMatch = mHair === uHair || (mHair && uHair && (mHair.includes(uHair) || uHair.includes(mHair)));
  const eyeMatch = mEye === uEye || (mEye && uEye && (mEye.includes(uEye) || uEye.includes(mEye)));

  const hairScore = hairMatch ? 5.0 : 0.0;
  const eyeScore = eyeMatch ? 5.0 : 0.0;
  const featuresScore = hairScore + eyeScore;

  if (hairMatch) {
    matchingAttributes.push(`Hair Color Match: '${missing.hair_color}'`);
  } else {
    differentAttributes.push(`Hair Color: '${missing.hair_color}' vs '${unidentified.hair_color}'`);
  }

  if (eyeMatch) {
    matchingAttributes.push(`Eye Color Match: '${missing.eye_color}'`);
  } else {
    differentAttributes.push(`Eye Color: '${missing.eye_color}' vs '${unidentified.eye_color}'`);
  }

  const featStatus = hairMatch && eyeMatch ? 'MATCH' : hairMatch || eyeMatch ? 'PARTIAL' : 'DIFFERENT';
  totalScore += featuresScore;

  breakdown.push({
    category: 'Hair & Eye Traits',
    weight_percentage: 10.0,
    score_achieved: Math.round(featuresScore * 10) / 10,
    status: featStatus,
    description: `Hair: ${missing.hair_color} / ${unidentified.hair_color} | Eye: ${missing.eye_color} / ${unidentified.eye_color}`
  });

  // 5. IDENTIFYING MARKS (25%)
  const mMarks = missing.identifying_marks || '';
  const uMarks = unidentified.identifying_marks || '';

  const mKw = extractKeywords(mMarks);
  const uKw = extractKeywords(uMarks);

  const commonMarks = [...mKw].filter((x) => uKw.has(x));
  let marksScore = 0.0;
  let marksStatus = 'DIFFERENT';

  if (mKw.size > 0 && uKw.size > 0) {
    const unionSize = new Set([...mKw, ...uKw]).size;
    const jaccard = unionSize > 0 ? commonMarks.length / unionSize : 0;
    marksScore = jaccard * 25.0;

    const keyTerms = new Set(['scar', 'tattoo', 'mole', 'birthmark', 'piercing', 'freckles', 'burn']);
    const matchedKeyTerms = commonMarks.filter((x) => keyTerms.has(x));
    if (matchedKeyTerms.length > 0 && marksScore < 18.0) {
      marksScore = Math.max(marksScore, 18.0);
    }
  } else if (mKw.size === 0 && uKw.size === 0) {
    marksScore = 12.5;
  } else {
    marksScore = 5.0;
  }

  marksScore = Math.min(25.0, marksScore);

  if (commonMarks.length > 0) {
    marksStatus = 'MATCH';
    matchingAttributes.push(`Identifying Marks Overlap: Matched terms [${commonMarks.join(', ')}]`);
  } else if (marksScore >= 12.5) {
    marksStatus = 'PARTIAL';
    matchingAttributes.push('Identifying Marks: No specific conflicting distinguishing marks');
  } else {
    marksStatus = 'DIFFERENT';
    differentAttributes.push(`Identifying Marks Mismatch: '${mMarks}' vs '${uMarks}'`);
  }

  totalScore += marksScore;
  breakdown.push({
    category: 'Identifying Marks',
    weight_percentage: 25.0,
    score_achieved: Math.round(marksScore * 10) / 10,
    status: marksStatus,
    description: `Missing: '${mMarks}' | Unidentified: '${uMarks}'`
  });

  // 6. CLOTHING DESCRIPTION (10%)
  const mCloth = missing.clothing_description || '';
  const uCloth = unidentified.clothing_description || '';

  const mCkw = extractKeywords(mCloth);
  const uCkw = extractKeywords(uCloth);
  const commonCloth = [...mCkw].filter((x) => uCkw.has(x));

  let clothScore = 0.0;
  if (mCkw.size > 0 && uCkw.size > 0) {
    const unionClothSize = new Set([...mCkw, ...uCkw]).size;
    const clothJaccard = unionClothSize > 0 ? commonCloth.length / unionClothSize : 0;
    clothScore = clothJaccard * 10.0;
    if (commonCloth.length > 0 && clothScore < 5.0) {
      clothScore = 6.0;
    }
  } else {
    clothScore = 4.0;
  }

  clothScore = Math.min(10.0, clothScore);
  const clothStatus = commonCloth.length > 0 ? 'MATCH' : clothScore >= 4.0 ? 'PARTIAL' : 'DIFFERENT';

  if (commonCloth.length > 0) {
    matchingAttributes.push(`Clothing Details Overlap: [${commonCloth.join(', ')}]`);
  } else {
    differentAttributes.push(`Clothing Details: '${mCloth}' vs '${uCloth}'`);
  }

  totalScore += clothScore;
  breakdown.push({
    category: 'Clothing Description',
    weight_percentage: 10.0,
    score_achieved: Math.round(clothScore * 10) / 10,
    status: clothStatus,
    description: `Missing: '${mCloth}' | Unidentified: '${uCloth}'`
  });

  // 7. DATE PROXIMITY (5%)
  const mDateStr = missing.last_seen_date || '';
  const uDateStr = unidentified.found_date || '';
  let dateScore = 2.5;
  let dateStatus = 'PARTIAL';
  let daysDiff = 9999;

  try {
    if (mDateStr && uDateStr) {
      const mDt = new Date(mDateStr);
      const uDt = new Date(uDateStr);
      daysDiff = Math.round((uDt - mDt) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 0) {
        if (daysDiff <= 3) {
          dateScore = 5.0;
          dateStatus = 'MATCH';
          matchingAttributes.push(`Date Proximity: Found ${daysDiff} days after last seen (${uDateStr})`);
        } else if (daysDiff <= 14) {
          dateScore = 4.0;
          dateStatus = 'PARTIAL';
          matchingAttributes.push(`Date Proximity: Found within ${daysDiff} days`);
        } else if (daysDiff <= 30) {
          dateScore = 3.0;
          dateStatus = 'PARTIAL';
          matchingAttributes.push(`Date Timeline: Found within ${daysDiff} days`);
        } else if (daysDiff <= 90) {
          dateScore = 2.0;
          dateStatus = 'PARTIAL';
          differentAttributes.push(`Time Gap: ${daysDiff} days between reported dates`);
        } else {
          dateScore = 1.0;
          dateStatus = 'DIFFERENT';
          differentAttributes.push(`Extended Time Gap: ${daysDiff} days elapsed`);
        }
      } else {
        const absDays = Math.abs(daysDiff);
        if (absDays <= 2) {
          dateScore = 3.0;
          dateStatus = 'PARTIAL';
          differentAttributes.push(`Minor Date Overlap: Found ${absDays} days before reported date`);
        } else {
          dateScore = 0.0;
          dateStatus = 'DIFFERENT';
          differentAttributes.push(`Date Discrepancy: Found date (${uDateStr}) precedes last seen (${mDateStr})`);
        }
      }
    }
  } catch {
    dateScore = 2.5;
    dateStatus = 'PARTIAL';
  }

  totalScore += dateScore;
  breakdown.push({
    category: 'Date Timeline',
    weight_percentage: 5.0,
    score_achieved: Math.round(dateScore * 10) / 10,
    status: dateStatus,
    description: `Last seen: ${mDateStr} | Found: ${uDateStr} (Diff: ${daysDiff} days)`
  });

  // GENDER CHECK
  const mG = (missing.gender || '').toLowerCase().trim();
  const uG = (unidentified.gender || '').toLowerCase().trim();
  if (mG && uG && mG !== uG && mG !== 'unknown' && uG !== 'unknown') {
    totalScore = Math.max(5.0, totalScore * 0.4);
    differentAttributes.unshift(`Gender Mismatch: Missing (${missing.gender}) vs Unidentified (${unidentified.gender})`);
  } else {
    if (mG && uG && mG === uG) {
      matchingAttributes.unshift(`Gender Match: ${missing.gender}`);
    }
  }

  const finalScore = Math.round(Math.min(100.0, Math.max(0.0, totalScore)) * 10) / 10;

  return {
    match_score: finalScore,
    classification: 'Potential Match',
    matching_attributes: matchingAttributes,
    different_attributes: differentAttributes,
    breakdown: breakdown
  };
}
