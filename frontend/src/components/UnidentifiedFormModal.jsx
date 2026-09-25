import React, { useState } from 'react';
import { X, Plus, MapPin } from 'lucide-react';

const CITIES_PRESETS = [
  { name: 'East River Greenway, New York, NY', lat: 40.7925, lon: -73.935 },
  { name: 'Millennium Park Area, Chicago, IL', lat: 41.8827, lon: -87.6233 },
  { name: 'Venice Beach Promenade, Los Angeles, CA', lat: 33.985, lon: -118.469 },
  { name: 'Biscayne Bay Park, Miami, FL', lat: 25.774, lon: -80.185 },
  { name: 'Embarcadero Pier, San Francisco, CA', lat: 37.795, lon: -122.393 },
];

export default function UnidentifiedFormModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    estimated_age: '30',
    gender: 'Male',
    height: '175',
    hair_color: 'Brown',
    eye_color: 'Brown',
    identifying_marks: '',
    location_name: CITIES_PRESETS[0].name,
    latitude: CITIES_PRESETS[0].lat,
    longitude: CITIES_PRESETS[0].lon,
    found_date: new Date().toISOString().split('T')[0],
    clothing_description: '',
    photo_url: ''
  });

  const handleCitySelect = (e) => {
    const selected = CITIES_PRESETS.find(c => c.name === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        location_name: selected.name,
        latitude: selected.lat,
        longitude: selected.lon
      }));
    } else {
      setFormData(prev => ({ ...prev, location_name: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.estimated_age) return;
    onSubmit({
      ...formData,
      estimated_age: parseInt(formData.estimated_age, 10),
      height: parseFloat(formData.height),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Unidentified Person</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Estimated Age (Years) *</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                min="0" max="120"
                value={formData.estimated_age}
                onChange={(e) => setFormData({ ...formData, estimated_age: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select 
                className="form-control" 
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Height (cm) *</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Hair Color *</label>
              <select 
                className="form-control"
                value={formData.hair_color}
                onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })}
              >
                <option value="Black">Black</option>
                <option value="Brown">Brown</option>
                <option value="Blonde">Blonde</option>
                <option value="Grey">Grey</option>
                <option value="Red">Red</option>
                <option value="Bald">Bald</option>
              </select>
            </div>

            <div className="form-group">
              <label>Eye Color *</label>
              <select 
                className="form-control"
                value={formData.eye_color}
                onChange={(e) => setFormData({ ...formData, eye_color: e.target.value })}
              >
                <option value="Brown">Brown</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Hazel">Hazel</option>
                <option value="Grey">Grey</option>
                <option value="Black">Black</option>
              </select>
            </div>

            <div className="form-group">
              <label>Found Date *</label>
              <input 
                type="date" 
                className="form-control" 
                required 
                value={formData.found_date}
                onChange={(e) => setFormData({ ...formData, found_date: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Found Location *</label>
              <select 
                className="form-control"
                value={formData.location_name}
                onChange={handleCitySelect}
              >
                {CITIES_PRESETS.map((city, idx) => (
                  <option key={idx} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Identifying Marks (scars, tattoos, birthmarks, physical features)</label>
              <textarea 
                className="form-control" 
                rows="2" 
                placeholder="e.g. Butterfly tattoo on left wrist, surgical scar on right knee"
                value={formData.identifying_marks}
                onChange={(e) => setFormData({ ...formData, identifying_marks: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Clothing Description</label>
              <textarea 
                className="form-control" 
                rows="2" 
                placeholder="e.g. Dark blue hoodie, grey denim jeans, black sneakers"
                value={formData.clothing_description}
                onChange={(e) => setFormData({ ...formData, clothing_description: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Photo URL (Optional)</label>
              <input 
                type="url" 
                className="form-control" 
                placeholder="https://example.com/photo.jpg (Leave empty for auto-generated avatar)"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-emerald">
              <Plus size={16} /> Save Unidentified Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
