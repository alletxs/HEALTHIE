import React from 'react';

export default function SkeletonLoader({ width = '100%', height = '20px', borderRadius = '8px' }) {
  return <div className="skeleton" style={{ width, height, borderRadius: borderRadius || '8px' }} />;
}
