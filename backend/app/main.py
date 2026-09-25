from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_indexes, get_db
from app.config import MISSING_COLLECTION
from app.seed_data import seed_database
from app.routes import dashboard, missing, unidentified, matching, seed

app = FastAPI(
    title="FindBack API",
    description="Intelligent Missing Person Matching System REST API",
    version="1.0.0"
)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router)
app.include_router(missing.router)
app.include_router(unidentified.router)
app.include_router(matching.router)
app.include_router(seed.router)

@app.on_event("startup")
def startup_event():
    print("Initializing MongoDB indexes...")
    init_indexes()
    
    # Auto seed if collection is completely empty
    db = get_db()
    if db[MISSING_COLLECTION].count_documents({}) == 0:
        print("Database empty. Seeding initial sample dataset...")
        seed_database()

@app.get("/")
def root():
    return {
        "system": "FindBack – Intelligent Missing Person Matching System",
        "status": "online",
        "docs_url": "/docs"
    }
