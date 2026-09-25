from fastapi import APIRouter, HTTPException, Query
from app.db import get_db
from app.config import UNIDENTIFIED_COLLECTION, MATCHES_COLLECTION
from app.models import UnidentifiedPersonCreate
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/unidentified-persons", tags=["Unidentified Persons"])

def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
        if "created_at" in doc and hasattr(doc["created_at"], "isoformat"):
            doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.get("")
def list_unidentified_persons(search: Optional[str] = Query(None, description="Search by mark, clothing, or location")):
    db = get_db()
    query = {}
    if search and search.strip():
        regex = {"$regex": search.strip(), "$options": "i"}
        query = {
            "$or": [
                {"identifying_marks": regex},
                {"location_name": regex},
                {"clothing_description": regex}
            ]
        }
    cursor = db[UNIDENTIFIED_COLLECTION].find(query).sort("created_at", -1)
    results = [serialize_doc(doc) for doc in cursor]
    return results

@router.get("/{person_id}")
def get_unidentified_person(person_id: str):
    db = get_db()
    try:
        doc = db[UNIDENTIFIED_COLLECTION].find_one({"_id": ObjectId(person_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid record ID format")
    if not doc:
        raise HTTPException(status_code=404, detail="Unidentified person record not found")
    return serialize_doc(doc)

@router.post("")
def create_unidentified_person(data: UnidentifiedPersonCreate):
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
    res = db[UNIDENTIFIED_COLLECTION].insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    doc["created_at"] = doc["created_at"].isoformat()
    return doc

@router.delete("/{person_id}")
def delete_unidentified_person(person_id: str):
    db = get_db()
    try:
        obj_id = ObjectId(person_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid record ID format")
    res = db[UNIDENTIFIED_COLLECTION].delete_one({"_id": obj_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Unidentified person record not found")
    # Clean up related matches
    db[MATCHES_COLLECTION].delete_many({"unidentified_person_id": person_id})
    return {"message": "Record deleted successfully"}
