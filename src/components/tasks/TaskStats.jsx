import React from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskStats() {
  const { stats, loading } = useTasks();

  const statCards = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: stats.total,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      colorClass: 'stat-blue'
    },
    {
      id: 'pending',
      label: 'In Progress',
      value: stats.pending,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      colorClass: 'stat-amber'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats.completed,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      colorClass: 'stat-emerald'
    },
    {
      id: 'highPriority',
      label: 'High Priority',
      value: stats.highPriority,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      colorClass: 'stat-rose'
    }
  ];

  return (
    <div className="stats-grid">
      {statCards.map((stat) => (
        <div key={stat.id} className={`stat-card ${stat.colorClass}`}>
          <div className="stat-icon-wrapper">
            {stat.icon}
          </div>
          <div className="stat-info">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">
              {loading ? <span className="stat-skeleton"></span> : stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
