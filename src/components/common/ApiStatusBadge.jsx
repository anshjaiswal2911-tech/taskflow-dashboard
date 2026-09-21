import React from 'react';
import { useTasks } from '../../context/TaskContext';

export default function ApiStatusBadge() {
  const { apiStatus, apiLatency, refreshTasks } = useTasks();

  const label =
    apiStatus === 'online' || apiStatus === 'connected'
      ? `API Online ${apiLatency ? `(${apiLatency}ms)` : ''}`
      : apiStatus === 'connecting'
      ? 'Connecting API...'
      : 'API Offline';

  return (
    <button
      className={`api-status-badge status-${apiStatus}`}
      onClick={() => refreshTasks(true)}
      title="Click to refresh API connection"
      aria-label={`Task 3 REST API Status: ${label}`}
    >
      <span className="api-dot" />
      <span>{label}</span>
    </button>
  );
}

