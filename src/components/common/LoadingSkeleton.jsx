import React from 'react';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card card">
          <div className="skeleton-row-top">
            <div className="skeleton-checkbox"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-description"></div>
          <div className="skeleton-row-bottom">
            <div className="skeleton-tag"></div>
            <div className="skeleton-date"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
