import urllib.parse
from datetime import datetime
from app.db import get_db
from app.config import MISSING_COLLECTION, UNIDENTIFIED_COLLECTION, MATCHES_COLLECTION
from app.matcher import compute_similarity

def make_avatar_svg(name: str, bg_color: str, text_color: str = "#ffffff") -> str:
    """Generates an SVG Data URI for realistic profile avatars."""
    initials = "".join([part[0].upper() for part in name.split()[:2]]) if name else "?"
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="{bg_color}" rx="12"/>
      <circle cx="100" cy="75" r="35" fill="{text_color}" opacity="0.3"/>
      <path d="M40,165 C40,120 70,110 100,110 C130,110 160,120 160,165 Z" fill="{text_color}" opacity="0.3"/>
      <text x="100" y="105" fill="{text_color}" font-family="Arial, sans-serif" font-size="42" font-weight="bold" text-anchor="middle">{initials}</text>
    </svg>'''
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)

SAMPLE_MISSING_PERSONS = [
    {
        "name": "Alexander Morgan",
        "age": 28,
        "gender": "Male",
        "height": 178,
        "hair_color": "Brown",
        "eye_color": "Blue",
        "identifying_marks": "Small butterfly tattoo on left wrist, surgical scar on right knee",
        "location_name": "Central Park, New York, NY",
        "latitude": 40.785091,
        "longitude": -73.968285,
        "last_seen_date": "2026-09-10",
        "clothing_description": "Navy blue hoodie, dark grey denim jeans, black Nike sneakers",
        "photo_url": make_avatar_svg("Alexander Morgan", "#2563eb")
    },
    {
        "name": "Sophia Chen",
        "age": 24,
        "gender": "Female",
        "height": 162,
        "hair_color": "Black",
        "eye_color": "Brown",
        "identifying_marks": "Small birthmark behind left ear, silver nose ring",
        "location_name": "Downtown Station, Chicago, IL",
        "latitude": 41.878114,
        "longitude": -87.629798,
        "last_seen_date": "2026-09-12",
        "clothing_description": "Beige trench coat, white wool sweater, brown leather boots",
        "photo_url": make_avatar_svg("Sophia Chen", "#ec4899")
    },
    {
        "name": "Marcus Vance",
        "age": 42,
        "gender": "Male",
        "height": 185,
        "hair_color": "Black",
        "eye_color": "Brown",
        "identifying_marks": "Anchor tattoo on left forearm, mole on chin",
        "location_name": "Santa Monica Pier, Los Angeles, CA",
        "latitude": 34.009985,
        "longitude": -118.496475,
        "last_seen_date": "2026-09-15",
        "clothing_description": "Red plaid flannel shirt, blue jeans, brown work boots",
        "photo_url": make_avatar_svg("Marcus Vance", "#059669")
    },
    {
        "name": "Elena Rostova",
        "age": 31,
        "gender": "Female",
        "height": 170,
        "hair_color": "Blonde",
        "eye_color": "Green",
        "identifying_marks": "Linear scar across left eyebrow, floral tattoo on shoulder",
        "location_name": "Ocean Drive, Miami, FL",
        "latitude": 25.780604,
        "longitude": -80.130043,
        "last_seen_date": "2026-09-18",
        "clothing_description": "Yellow summer dress, white sandals, black sunglasses",
        "photo_url": make_avatar_svg("Elena Rostova", "#d97706")
    },
    {
        "name": "David Miller",
        "age": 65,
        "gender": "Male",
        "height": 173,
        "hair_color": "Grey",
        "eye_color": "Hazel",
        "identifying_marks": "Wears prescription glasses, pacemaker scar on chest",
        "location_name": "Market Street, San Francisco, CA",
        "latitude": 37.789721,
        "longitude": -122.401142,
        "last_seen_date": "2026-09-05",
        "clothing_description": "Green cardigan sweater, khaki trousers, walking shoes",
        "photo_url": make_avatar_svg("David Miller", "#4b5563")
    }
]

SAMPLE_UNIDENTIFIED_PERSONS = [
    {
        "estimated_age": 29,
        "gender": "Male",
        "height": 177,
        "hair_color": "Brown",
        "eye_color": "Blue",
        "identifying_marks": "Butterfly tattoo on left wrist, knee scar",
        "location_name": "East River Greenway, New York, NY",
        "latitude": 40.792500,
        "longitude": -73.935000,
        "found_date": "2026-09-12",
        "clothing_description": "Dark blue hoodie, grey denim jeans, black sneakers",
        "photo_url": make_avatar_svg("Unidentified Male NY", "#1d4ed8")
    },
    {
        "estimated_age": 25,
        "gender": "Female",
        "height": 163,
        "hair_color": "Black",
        "eye_color": "Brown",
        "identifying_marks": "Birthmark near ear, nose piercing",
        "location_name": "Millennium Park Area, Chicago, IL",
        "latitude": 41.882700,
        "longitude": -87.623300,
        "found_date": "2026-09-14",
        "clothing_description": "Beige coat, white knit sweater, leather boots",
        "photo_url": make_avatar_svg("Unidentified Female CHI", "#db2777")
    },
    {
        "estimated_age": 40,
        "gender": "Male",
        "height": 184,
        "hair_color": "Black",
        "eye_color": "Brown",
        "identifying_marks": "Forearm anchor tattoo",
        "location_name": "Venice Beach Promenade, Los Angeles, CA",
        "latitude": 33.985000,
        "longitude": -118.469000,
        "found_date": "2026-09-17",
        "clothing_description": "Red plaid shirt, blue denim pants",
        "photo_url": make_avatar_svg("Unidentified Male LA", "#047857")
    },
    {
        "estimated_age": 30,
        "gender": "Female",
        "height": 169,
        "hair_color": "Blonde",
        "eye_color": "Green",
        "identifying_marks": "Scar near left eye, shoulder tattoo",
        "location_name": "Biscayne Bay Park, Miami, FL",
        "latitude": 25.774000,
        "longitude": -80.185000,
        "found_date": "2026-09-20",
        "clothing_description": "Yellow floral dress, white sandals",
        "photo_url": make_avatar_svg("Unidentified Female MIA", "#b45309")
    }
]

def seed_database():
    """Seeds the database with realistic initial data and computes matches."""
    db = get_db()

    # Clear existing collections
    db[MISSING_COLLECTION].delete_many({})
    db[UNIDENTIFIED_COLLECTION].delete_many({})
    db[MATCHES_COLLECTION].delete_many({})

    missing_inserted_ids = []
    unidentified_inserted_ids = []

    # Insert Missing Persons
    for person in SAMPLE_MISSING_PERSONS:
        doc = person.copy()
        doc["location"] = {
            "name": person["location_name"],
            "geo": {
                "type": "Point",
                "coordinates": [person["longitude"], person["latitude"]]
            }
        }
        doc["created_at"] = datetime.now()
        res = db[MISSING_COLLECTION].insert_one(doc)
        missing_inserted_ids.append((str(res.inserted_id), doc))

    # Insert Unidentified Persons
    for person in SAMPLE_UNIDENTIFIED_PERSONS:
        doc = person.copy()
        doc["location"] = {
            "name": person["location_name"],
            "geo": {
                "type": "Point",
                "coordinates": [person["longitude"], person["latitude"]]
            }
        }
        doc["created_at"] = datetime.now()
        res = db[UNIDENTIFIED_COLLECTION].insert_one(doc)
        unidentified_inserted_ids.append((str(res.inserted_id), doc))

    # Precompute matches
    match_count = 0
    for m_id, m_doc in missing_inserted_ids:
        for u_id, u_doc in unidentified_inserted_ids:
            match_res = compute_similarity(m_doc, u_doc)
            # Only store if match score is >= 30%
            if match_res["match_score"] >= 30.0:
                match_doc = {
                    "missing_person_id": m_id,
                    "unidentified_person_id": u_id,
                    "match_score": match_res["match_score"],
                    "classification": match_res["classification"],
                    "matching_attributes": match_res["matching_attributes"],
                    "different_attributes": match_res["different_attributes"],
                    "breakdown": match_res["breakdown"],
                    "created_at": datetime.now()
                }
                db[MATCHES_COLLECTION].insert_one(match_doc)
                match_count += 1

    return {
        "status": "success",
        "missing_count": len(missing_inserted_ids),
        "unidentified_count": len(unidentified_inserted_ids),
        "matches_generated": match_count
    }
