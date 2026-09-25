import math
from datetime import datetime
import re
from typing import Dict, Any, List, Tuple

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two lat/lon coordinates in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def extract_keywords(text: str) -> set:
    """Extracts lowercase meaningful keywords from text."""
    if not text:
        return set()
    words = re.findall(r'\b[a-zA-Z0-9]+\b', text.lower())
    stop_words = {'a', 'an', 'the', 'in', 'on', 'at', 'of', 'and', 'or', 'with', 'wears', 'wearing', 'has', 'was'}
    return {w for w in words if w not in stop_words and len(w) > 1}

def compute_similarity(missing: Dict[str, Any], unidentified: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes weighted multi-attribute similarity score (0 to 100%)
    between a missing person record and an unidentified person record.
    Returns score, breakdown list, matching attributes, and different attributes.
    """
    matching_attributes: List[str] = []
    different_attributes: List[str] = []
    breakdown: List[Dict[str, Any]] = []
    
    total_score = 0.0

    # 1. AGE (15%)
    m_age = missing.get("age", 0)
    u_age = unidentified.get("estimated_age", 0)
    age_diff = abs(m_age - u_age)
    
    if age_diff == 0:
        age_score = 15.0
        age_status = "MATCH"
        matching_attributes.append(f"Age Match: Exactly {m_age} yrs old")
    elif age_diff <= 1:
        age_score = 13.5
        age_status = "PARTIAL"
        matching_attributes.append(f"Age Proximity: {m_age} yrs vs estimated {u_age} yrs (±1 yr)")
    elif age_diff <= 3:
        age_score = 10.5
        age_status = "PARTIAL"
        matching_attributes.append(f"Age Proximity: {m_age} yrs vs estimated {u_age} yrs (±{age_diff} yrs)")
    elif age_diff <= 5:
        age_score = 6.0
        age_status = "PARTIAL"
        different_attributes.append(f"Age Difference: {m_age} yrs vs estimated {u_age} yrs (±{age_diff} yrs)")
    elif age_diff <= 10:
        age_score = 3.0
        age_status = "DIFFERENT"
        different_attributes.append(f"Significant Age Gap: {m_age} yrs vs estimated {u_age} yrs")
    else:
        age_score = 0.0
        age_status = "DIFFERENT"
        different_attributes.append(f"Large Age Mismatch: {m_age} yrs vs estimated {u_age} yrs")

    total_score += age_score
    breakdown.append({
        "category": "Age Similarity",
        "weight_percentage": 15.0,
        "score_achieved": round(age_score, 1),
        "status": age_status,
        "description": f"Missing: {m_age} yrs | Unidentified: ~{u_age} yrs (Diff: {age_diff} yrs)"
    })

    # 2. LOCATION (20%)
    m_lat = missing.get("latitude", 0.0)
    m_lon = missing.get("longitude", 0.0)
    u_lat = unidentified.get("latitude", 0.0)
    u_lon = unidentified.get("longitude", 0.0)
    
    dist_km = haversine_distance(m_lat, m_lon, u_lat, u_lon)
    m_loc_name = missing.get("location_name", "Unknown")
    u_loc_name = unidentified.get("location_name", "Unknown")

    if dist_km <= 5.0:
        loc_score = 20.0
        loc_status = "MATCH"
        matching_attributes.append(f"Geospatial Proximity: {dist_km:.1f} km apart ({m_loc_name} & {u_loc_name})")
    elif dist_km <= 25.0:
        loc_score = 16.0
        loc_status = "PARTIAL"
        matching_attributes.append(f"Nearby Area: {dist_km:.1f} km distance between reported locations")
    elif dist_km <= 75.0:
        loc_score = 12.0
        loc_status = "PARTIAL"
        matching_attributes.append(f"Same Region: {dist_km:.1f} km distance")
    elif dist_km <= 200.0:
        loc_score = 8.0
        loc_status = "PARTIAL"
        different_attributes.append(f"Location Distance: {dist_km:.1f} km separation")
    elif dist_km <= 500.0:
        loc_score = 4.0
        loc_status = "DIFFERENT"
        different_attributes.append(f"Far Location: {dist_km:.1f} km apart")
    else:
        loc_score = 0.0
        loc_status = "DIFFERENT"
        different_attributes.append(f"Distant Location: {dist_km:.1f} km apart ({m_loc_name} vs {u_loc_name})")

    total_score += loc_score
    breakdown.append({
        "category": "Location Proximity",
        "weight_percentage": 20.0,
        "score_achieved": round(loc_score, 1),
        "status": loc_status,
        "description": f"Distance: {dist_km:.1f} km between '{m_loc_name}' and '{u_loc_name}'"
    })

    # 3. HEIGHT (15%)
    m_h = missing.get("height", 0.0)
    u_h = unidentified.get("height", 0.0)
    h_diff = abs(m_h - u_h)

    if h_diff == 0:
        h_score = 15.0
        h_status = "MATCH"
        matching_attributes.append(f"Height Match: Exactly {m_h:.0f} cm")
    elif h_diff <= 2.0:
        h_score = 13.5
        h_status = "PARTIAL"
        matching_attributes.append(f"Height Match: {m_h:.0f} cm vs {u_h:.0f} cm (±{h_diff:.0f} cm)")
    elif h_diff <= 5.0:
        h_score = 10.5
        h_status = "PARTIAL"
        matching_attributes.append(f"Height Close: {m_h:.0f} cm vs {u_h:.0f} cm (±{h_diff:.0f} cm)")
    elif h_diff <= 10.0:
        h_score = 6.0
        h_status = "PARTIAL"
        different_attributes.append(f"Height Variance: {m_h:.0f} cm vs {u_h:.0f} cm (Diff: {h_diff:.0f} cm)")
    elif h_diff <= 15.0:
        h_score = 3.0
        h_status = "DIFFERENT"
        different_attributes.append(f"Height Difference: {m_h:.0f} cm vs {u_h:.0f} cm (Diff: {h_diff:.0f} cm)")
    else:
        h_score = 0.0
        h_status = "DIFFERENT"
        different_attributes.append(f"Significant Height Mismatch: {m_h:.0f} cm vs {u_h:.0f} cm")

    total_score += h_score
    breakdown.append({
        "category": "Height Similarity",
        "weight_percentage": 15.0,
        "score_achieved": round(h_score, 1),
        "status": h_status,
        "description": f"Missing: {m_h:.0f} cm | Unidentified: {u_h:.0f} cm (Diff: {h_diff:.0f} cm)"
    })

    # 4. HAIR & EYE CHARACTERISTICS (10%)
    m_hair = missing.get("hair_color", "").lower().strip()
    u_hair = unidentified.get("hair_color", "").lower().strip()
    m_eye = missing.get("eye_color", "").lower().strip()
    u_eye = unidentified.get("eye_color", "").lower().strip()

    hair_match = (m_hair == u_hair) or (m_hair in u_hair or u_hair in m_hair)
    eye_match = (m_eye == u_eye) or (m_eye in u_eye or u_eye in m_eye)

    hair_score = 5.0 if hair_match else 0.0
    eye_score = 5.0 if eye_match else 0.0
    features_score = hair_score + eye_score

    if hair_match:
        matching_attributes.append(f"Hair Color Match: '{missing.get('hair_color')}'")
    else:
        different_attributes.append(f"Hair Color: '{missing.get('hair_color')}' vs '{unidentified.get('hair_color')}'")

    if eye_match:
        matching_attributes.append(f"Eye Color Match: '{missing.get('eye_color')}'")
    else:
        different_attributes.append(f"Eye Color: '{missing.get('eye_color')}' vs '{unidentified.get('eye_color')}'")

    feat_status = "MATCH" if (hair_match and eye_match) else ("PARTIAL" if (hair_match or eye_match) else "DIFFERENT")
    total_score += features_score

    breakdown.append({
        "category": "Hair & Eye Traits",
        "weight_percentage": 10.0,
        "score_achieved": round(features_score, 1),
        "status": feat_status,
        "description": f"Hair: {missing.get('hair_color')} / {unidentified.get('hair_color')} | Eye: {missing.get('eye_color')} / {unidentified.get('eye_color')}"
    })

    # 5. IDENTIFYING MARKS (25%)
    m_marks = missing.get("identifying_marks", "")
    u_marks = unidentified.get("identifying_marks", "")

    m_kw = extract_keywords(m_marks)
    u_kw = extract_keywords(u_marks)

    common_marks = m_kw.intersection(u_kw)

    if m_kw and u_kw:
        union_marks = m_kw.union(u_kw)
        jaccard = len(common_marks) / len(union_marks) if union_marks else 0
        marks_score = jaccard * 25.0
        # Give bonus if specific key terms like scar, tattoo, mole, birthmark match
        key_terms = {'scar', 'tattoo', 'mole', 'birthmark', 'piercing', 'freckles', 'burn'}
        matched_key_terms = common_marks.intersection(key_terms)
        if matched_key_terms and marks_score < 18.0:
            marks_score = max(marks_score, 18.0)
    elif not m_kw and not u_kw:
        marks_score = 12.5  # Neither reported distinguishing marks
        jaccard = 0.5
    else:
        marks_score = 5.0
        jaccard = 0.2

    marks_score = min(25.0, marks_score)

    if common_marks:
        marks_status = "MATCH"
        matching_attributes.append(f"Identifying Marks Overlap: Matched terms [{', '.join(common_marks)}]")
    elif marks_score >= 12.5:
        marks_status = "PARTIAL"
        matching_attributes.append("Identifying Marks: No specific conflicting distinguishing marks")
    else:
        marks_status = "DIFFERENT"
        different_attributes.append(f"Identifying Marks Mismatch: '{m_marks}' vs '{u_marks}'")

    total_score += marks_score
    breakdown.append({
        "category": "Identifying Marks",
        "weight_percentage": 25.0,
        "score_achieved": round(marks_score, 1),
        "status": marks_status,
        "description": f"Missing: '{m_marks}' | Unidentified: '{u_marks}'"
    })

    # 6. CLOTHING DESCRIPTION (10%)
    m_cloth = missing.get("clothing_description", "")
    u_cloth = unidentified.get("clothing_description", "")

    m_ckw = extract_keywords(m_cloth)
    u_ckw = extract_keywords(u_cloth)
    common_cloth = m_ckw.intersection(u_ckw)

    if m_ckw and u_ckw:
        cloth_jaccard = len(common_cloth) / len(m_ckw.union(u_ckw)) if m_ckw.union(u_ckw) else 0
        cloth_score = cloth_jaccard * 10.0
        if common_cloth and cloth_score < 5.0:
            cloth_score = 6.0
    else:
        cloth_score = 4.0

    cloth_score = min(10.0, cloth_score)
    cloth_status = "MATCH" if common_cloth else ("PARTIAL" if cloth_score >= 4.0 else "DIFFERENT")

    if common_cloth:
        matching_attributes.append(f"Clothing Details Overlap: [{', '.join(common_cloth)}]")
    else:
        different_attributes.append(f"Clothing Details: '{m_cloth}' vs '{u_cloth}'")

    total_score += cloth_score
    breakdown.append({
        "category": "Clothing Description",
        "weight_percentage": 10.0,
        "score_achieved": round(cloth_score, 1),
        "status": cloth_status,
        "description": f"Missing: '{m_cloth}' | Unidentified: '{u_cloth}'"
    })

    # 7. DATE PROXIMITY (5%)
    m_date_str = missing.get("last_seen_date", "")
    u_date_str = unidentified.get("found_date", "")
    
    date_score = 0.0
    date_status = "DIFFERENT"
    days_diff = 9999

    try:
        m_dt = datetime.strptime(m_date_str, "%Y-%m-%d")
        u_dt = datetime.strptime(u_date_str, "%Y-%m-%d")
        days_diff = (u_dt - m_dt).days

        if days_diff >= 0:  # Found after or on date last seen
            if days_diff <= 3:
                date_score = 5.0
                date_status = "MATCH"
                matching_attributes.append(f"Date Proximity: Found {days_diff} days after last seen ({u_date_str})")
            elif days_diff <= 14:
                date_score = 4.0
                date_status = "PARTIAL"
                matching_attributes.append(f"Date Proximity: Found within {days_diff} days")
            elif days_diff <= 30:
                date_score = 3.0
                date_status = "PARTIAL"
                matching_attributes.append(f"Date Timeline: Found within {days_diff} days")
            elif days_diff <= 90:
                date_score = 2.0
                date_status = "PARTIAL"
                different_attributes.append(f"Time Gap: {days_diff} days between reported dates")
            else:
                date_score = 1.0
                date_status = "DIFFERENT"
                different_attributes.append(f"Extended Time Gap: {days_diff} days elapsed")
        else:
            # Found date is BEFORE last seen date - unlikely unless error
            abs_days = abs(days_diff)
            if abs_days <= 2:
                date_score = 3.0
                date_status = "PARTIAL"
                different_attributes.append(f"Minor Date Overlap: Found {abs_days} days before reported date")
            else:
                date_score = 0.0
                date_status = "DIFFERENT"
                different_attributes.append(f"Date Discrepancy: Found date ({u_date_str}) precedes last seen ({m_date_str})")
    except Exception:
        date_score = 2.5
        date_status = "PARTIAL"

    total_score += date_score
    breakdown.append({
        "category": "Date Timeline",
        "weight_percentage": 5.0,
        "score_achieved": round(date_score, 1),
        "status": date_status,
        "description": f"Last seen: {m_date_str} | Found: {u_date_str} (Diff: {days_diff} days)"
    })

    # GENDER CHECK (Penalty modifier if explicitly conflicting)
    m_g = missing.get("gender", "").lower().strip()
    u_g = unidentified.get("gender", "").lower().strip()
    if m_g and u_g and m_g != u_g and m_g != "unknown" and u_g != "unknown":
        # Soft penalty when gender conflicts explicitly
        total_score = max(5.0, total_score * 0.4)
        different_attributes.insert(0, f"Gender Mismatch: Missing ({missing.get('gender')}) vs Unidentified ({unidentified.get('gender')})")
    else:
        if m_g and u_g and m_g == u_g:
            matching_attributes.insert(0, f"Gender Match: {missing.get('gender')}")

    final_score = round(min(100.0, max(0.0, total_score)), 1)

    return {
        "match_score": final_score,
        "classification": "Potential Match",
        "matching_attributes": matching_attributes,
        "different_attributes": different_attributes,
        "breakdown": breakdown
    }
