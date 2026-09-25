# FindBack – Intelligent Missing & Unidentified Persons Matching System

FindBack is an automated intelligence platform that bridges the gap between missing person reports and unidentified persons found by authorities or hospitals. It leverages multi-attribute weighted scoring (age, geospatial coordinates, height, hair/eye traits, distinguishing marks, clothing, and date timelines) to discover and rank potential matches in real-time.

🌐 **Live Demo (GitHub Pages)**: [https://mayreddykruthika-alt.github.io/findback/](https://mayreddykruthika-alt.github.io/findback/)

---

## 🚀 Key Features

- **Automated Case Matching**: Multi-criteria weighted algorithmic engine (location radius via Haversine, age tolerance, height variation, keyword jaccard similarity on scars/tattoos, and timeline analysis).
- **Interactive Dashboard**: Real-time statistics, case counts, quick report actions, and match overview.
- **Reporting Modals**: Easy-to-use forms for reporting missing individuals or logging unidentified records with auto-generated avatars.
- **Detailed Match Breakdown**: Full transparency into match scoring with confidence tags (High, Moderate, Low), matching attributes, and differing traits.
- **Hybrid Standalone / API Architecture**: Runs seamlessly in the cloud on GitHub Pages with built-in client-side data & matching engine, or locally with the FastAPI & MongoDB backend.

---

## 🛠️ Project Structure

```
findback/
├── .github/workflows/deploy.yml   # Automatic GitHub Pages CI/CD workflow
├── docs/                          # Pre-built static site bundle for GitHub Pages
├── backend/                       # Python FastAPI + MongoDB REST API
│   ├── app/
│   │   ├── matcher.py             # Algorithmic similarity & scoring engine
│   │   ├── seed_data.py           # Realistic sample cases & initial data
│   │   ├── routes/                # Dashboard, missing, unidentified, matching API
│   │   ├── models.py              # Pydantic schemas
│   │   └── db.py                  # MongoDB connection helper
│   ├── requirements.txt
│   └── run.py                     # Uvicorn entry point
├── frontend/                      # React 18 + Vite frontend
│   ├── src/
│   │   ├── pages/                 # Dashboard, Missing, Unidentified, Matches
│   │   ├── components/            # UI Modals, StatCards, PersonCards, Navbar
│   │   ├── services/              # API layer & Client-side Matcher Engine
│   │   └── index.css              # Custom styling & dark-theme design tokens
│   ├── package.json
│   └── vite.config.js
└── index.html                     # Root redirect for GitHub Pages
```

---

## 💻 Local Setup & Development

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Backend (Optional for local MongoDB)
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend runs at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

---

## 📄 License
MIT
