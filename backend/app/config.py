import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "findback_db")

MISSING_COLLECTION = "missing_persons"
UNIDENTIFIED_COLLECTION = "unidentified_persons"
MATCHES_COLLECTION = "match_results"
