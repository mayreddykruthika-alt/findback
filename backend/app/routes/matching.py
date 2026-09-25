from fastapi import APIRouter, HTTPException, Query
from app.db import get_db
from app.config import MISSING_COLLECTION, UNIDENTIFIED_COLLECTION, MATCHES_COLLECTION
from app.matcher import compute_similarity
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/matching", tags=["Intelligent Matching"])

def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.post("/find/{missing_id}")
def run_matching_for_missing(missing_id: str):
    """
    Compares the given missing person record against all unidentified person records.
    Stores match results in MongoDB match_results collection and returns sorted matches.
    """
    db = get_db()
    try:
        missing_doc = db[MISSING_COLLECTION].find_one({"_id": ObjectId(missing_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid missing person ID")

    if not missing_doc:
        raise HTTPException(status_code=404, detail="Missing person record not found")

    unidentified_cursor = db[UNIDENTIFIED_COLLECTION].find()
    unidentified_list = list(unidentified_cursor)

    results = []

    for u_doc in unidentified_list:
        u_id = str(u_doc["_id"])
        sim_res = compute_similarity(missing_doc, u_doc)

        match_score = sim_res["match_score"]
        
        # Save or update match result in MongoDB
        match_payload = {
            "missing_person_id": missing_id,
            "unidentified_person_id": u_id,
            "match_score": match_score,
            "classification": "Potential Match",
            "matching_attributes": sim_res["matching_attributes"],
            "different_attributes": sim_res["different_attributes"],
            "breakdown": sim_res["breakdown"],
            "created_at": datetime.now()
        }

        db[MATCHES_COLLECTION].update_one(
            {"missing_person_id": missing_id, "unidentified_person_id": u_id},
            {"$set": match_payload},
            upsert=True
        )

        match_payload["missing_person"] = serialize_doc(missing_doc.copy())
        match_payload["unidentified_person"] = serialize_doc(u_doc.copy())
        results.append(match_payload)

    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return {
        "missing_person_id": missing_id,
        "total_compared": len(unidentified_list),
        "matches": results
    }

@router.get("/all")
def get_all_matches(min_score: float = Query(0.0, description="Minimum match percentage threshold")):
    """Returns all computed potential matches sorted by score."""
    db = get_db()
    matches_cursor = db[MATCHES_COLLECTION].find({"match_score": {"$gte": min_score}}).sort("match_score", -1)
    
    populated_results = []
    for m in matches_cursor:
        m_id = m.get("missing_person_id")
        u_id = m.get("unidentified_person_id")

        m_doc = db[MISSING_COLLECTION].find_one({"_id": ObjectId(m_id)}) if m_id else None
        u_doc = db[UNIDENTIFIED_COLLECTION].find_one({"_id": ObjectId(u_id)}) if u_id else None

        if m_doc and u_doc:
            item = serialize_doc(m)
            item["missing_person"] = serialize_doc(m_doc)
            item["unidentified_person"] = serialize_doc(u_doc)
            populated_results.append(item)

    return populated_results

@router.get("/{match_id}")
def get_match_detail(match_id: str):
    """Returns details of a specific match result by match ID."""
    db = get_db()
    try:
        match_doc = db[MATCHES_COLLECTION].find_one({"_id": ObjectId(match_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid match ID format")

    if not match_doc:
        raise HTTPException(status_code=404, detail="Match result not found")

    m_id = match_doc.get("missing_person_id")
    u_id = match_doc.get("unidentified_person_id")

    m_doc = db[MISSING_COLLECTION].find_one({"_id": ObjectId(m_id)}) if m_id else None
    u_doc = db[UNIDENTIFIED_COLLECTION].find_one({"_id": ObjectId(u_id)}) if u_id else None

    item = serialize_doc(match_doc)
    item["missing_person"] = serialize_doc(m_doc) if m_doc else {}
    item["unidentified_person"] = serialize_doc(u_doc) if u_doc else {}

    return item
