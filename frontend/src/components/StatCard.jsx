import React from 'react';

export default function StatCard({ label, value, caption, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {caption && <div className="stat-caption">{caption}</div>}
      </div>
    </div>
  );
}
