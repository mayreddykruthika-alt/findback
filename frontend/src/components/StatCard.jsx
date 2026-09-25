import React from 'react';

export default function StatCard({ label, value, icon: Icon, color, bgColor }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor, color: color }}>
        <Icon size={26} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
