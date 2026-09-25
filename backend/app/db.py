from pymongo import MongoClient, GEOSPHERE, TEXT, ASCENDING, DESCENDING
from app.config import MONGO_URI, DB_NAME, MISSING_COLLECTION, UNIDENTIFIED_COLLECTION, MATCHES_COLLECTION
import sys

_client = None

def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    return _client

def get_db():
    client = get_client()
    return client[DB_NAME]

def init_indexes():
    """Initializes MongoDB indexes for 2dsphere geospatial search & text search."""
    try:
        db = get_db()
        # Missing persons indexes
        db[MISSING_COLLECTION].create_index([("location.geo", GEOSPHERE)], name="location_2dsphere")
        db[MISSING_COLLECTION].create_index([("name", ASCENDING)])
        db[MISSING_COLLECTION].create_index([("created_at", DESCENDING)])

        # Unidentified persons indexes
        db[UNIDENTIFIED_COLLECTION].create_index([("location.geo", GEOSPHERE)], name="location_2dsphere")
        db[UNIDENTIFIED_COLLECTION].create_index([("created_at", DESCENDING)])

        # Match results indexes
        db[MATCHES_COLLECTION].create_index([("missing_person_id", ASCENDING), ("unidentified_person_id", ASCENDING)], unique=True)
        db[MATCHES_COLLECTION].create_index([("match_score", DESCENDING)])

        print("MongoDB Indexes Initialized Successfully!")
    except Exception as e:
        print(f"Warning initializing indexes: {e}")
