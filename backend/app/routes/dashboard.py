from fastapi import APIRouter
from app.db import get_db
from app.config import MISSING_COLLECTION, UNIDENTIFIED_COLLECTION, MATCHES_COLLECTION
from bson import ObjectId

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.get("")
def get_dashboard_summary():
    """Returns total reports count, total unidentified count, total matches found, and recent reports."""
    db = get_db()
    
    total_missing = db[MISSING_COLLECTION].count_documents({})
    total_unidentified = db[UNIDENTIFIED_COLLECTION].count_documents({})
    total_matches = db[MATCHES_COLLECTION].count_documents({"match_score": {"$gte": 50.0}})
    
    recent_missing_cursor = db[MISSING_COLLECTION].find().sort("created_at", -1).limit(5)
    recent_missing = [serialize_doc(doc) for doc in recent_missing_cursor]
    
    recent_unidentified_cursor = db[UNIDENTIFIED_COLLECTION].find().sort("created_at", -1).limit(5)
    recent_unidentified = [serialize_doc(doc) for doc in recent_unidentified_cursor]

    return {
        "total_missing": total_missing,
        "total_unidentified": total_unidentified,
        "total_potential_matches": total_matches,
        "recent_missing": recent_missing,
        "recent_unidentified": recent_unidentified
    }
