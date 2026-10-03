import React from 'react';

export default function StatusBadge({ value }) {
  const key = String(value || 'UNKNOWN').toLowerCase().replaceAll('_', '-');
  return <span className={`badge badge-${key}`}>{String(value || 'Unknown').replaceAll('_', ' ')}</span>;
}
