from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] = [0.0, 0.0]  # [longitude, latitude]

class LocationData(BaseModel):
    name: str = Field(..., description="Location name, e.g. Central Park, New York")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    geo: Optional[GeoPoint] = None

class MissingPersonCreate(BaseModel):
    name: str
    age: int
    gender: str
    height: float  # cm
    hair_color: str
    eye_color: str
    identifying_marks: str
    location_name: str
    latitude: float
    longitude: float
    last_seen_date: str  # YYYY-MM-DD
    clothing_description: str
    photo_url: Optional[str] = None

class UnidentifiedPersonCreate(BaseModel):
    estimated_age: int
    gender: str
    height: float  # cm
    hair_color: str
    eye_color: str
    identifying_marks: str
    location_name: str
    latitude: float
    longitude: float
    found_date: str  # YYYY-MM-DD
    clothing_description: str
    photo_url: Optional[str] = None

class MatchBreakdownItem(BaseModel):
    category: str
    weight_percentage: float
    score_achieved: float
    status: str  # "MATCH", "PARTIAL", "DIFFERENT", "MISSING"
    description: str

class PotentialMatchResponse(BaseModel):
    id: str
    missing_person_id: str
    unidentified_person_id: str
    match_score: float
    classification: str = "Potential Match"
    matching_attributes: List[str]
    different_attributes: List[str]
    breakdown: List[MatchBreakdownItem]
    missing_person: Dict[str, Any]
    unidentified_person: Dict[str, Any]
    created_at: str
