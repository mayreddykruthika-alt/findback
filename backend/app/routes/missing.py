from fastapi import APIRouter, HTTPException, Query
from app.db import get_db
from app.config import MISSING_COLLECTION, MATCHES_COLLECTION
from app.models import MissingPersonCreate
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/missing-persons", tags=["Missing Persons"])

def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.get("")
def list_missing_persons(search: Optional[str] = Query(None, description="Search query by name, mark, or location")):
    db = get_db()
    query = {}
    if search and search.strip():
        regex = {"$regex": search.strip(), "$options": "i"}
        query = {
            "$or": [
                {"name": regex},
                {"identifying_marks": regex},
                {"location_name": regex},
                {"clothing_description": regex}
            ]
        }
    cursor = db[MISSING_COLLECTION].find(query).sort("created_at", -1)
    results = [serialize_doc(doc) for doc in cursor]
    return results

@router.get("/{person_id}")
def get_missing_person(person_id: str):
    db = get_db()
    try:
        doc = db[MISSING_COLLECTION].find_one({"_id": ObjectId(person_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid person ID format")
    if not doc:
        raise HTTPException(status_code=404, detail="Missing person record not found")
    return serialize_doc(doc)

@router.post("")
def create_missing_person(data: MissingPersonCreate):
    db = get_db()
    doc = data.dict()
    doc["location"] = {
        "name": data.location_name,
        "geo": {
            "type": "Point",
            "coordinates": [data.longitude, data.latitude]
        }
    }
    doc["created_at"] = datetime.now()
    res = db[MISSING_COLLECTION].insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.get("/near/search")
def search_missing_near(
    latitude: float = Query(..., description="Center latitude"),
    longitude: float = Query(..., description="Center longitude"),
    max_distance_km: float = Query(50.0, description="Max radius distance in kilometers")
):
    """Uses MongoDB 2dsphere $nearSphere operator to find missing persons within radius."""
    db = get_db()
    max_distance_meters = max_distance_km * 1000.0
    query = {
        "location.geo": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": max_distance_meters
            }
        }
    }
    cursor = db[MISSING_COLLECTION].find(query)
    results = [serialize_doc(doc) for doc in cursor]
    return results

@router.delete("/{person_id}")
def delete_missing_person(person_id: str):
    db = get_db()
    try:
        obj_id = ObjectId(person_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid person ID format")
    res = db[MISSING_COLLECTION].delete_one({"_id": obj_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Missing person record not found")
    # Clean up related matches
    db[MATCHES_COLLECTION].delete_many({"missing_person_id": person_id})
    return {"message": "Record deleted successfully"}
