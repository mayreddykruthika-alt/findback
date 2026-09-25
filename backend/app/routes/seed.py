from fastapi import APIRouter
from app.seed_data import seed_database

router = APIRouter(prefix="/api/seed", tags=["Seed Data"])

@router.post("")
def trigger_seed():
    """Seeds database with sample missing & unidentified records and computes matches."""
    res = seed_database()
    return res
