import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import taskService from '../api/taskService';
import { DEFAULT_API_BASE_URL, getApiBaseUrl, setApiBaseUrl } from '../api/apiClient';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { refreshTasks, apiStatus } = useTasks();
  const toast = useToast();

  const [apiUrl, setApiUrl] = useState(() => {
    return getApiBaseUrl();
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
    if (!cleanUrl) {
      toast.error('API URL cannot be empty.');
      return;
    }
    setApiBaseUrl(cleanUrl);
    toast.success('API endpoint updated! Reconnecting...');
    refreshTasks();
  };

  const handleResetApiUrl = () => {
    setApiUrl(DEFAULT_API_BASE_URL);
    setApiBaseUrl('');
    toast.info('API endpoint reset to default Task 3 server.');
    refreshTasks();
  };


  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const health = await taskService.checkHealth();
      if (health && health.online) {
        setTestResult({ success: true, message: `Successfully connected to REST API server! (${health.latency}ms latency)` });
        toast.success('API connection verified!');
      } else {
        setTestResult({ success: false, message: health?.message || 'Server did not return a healthy response.' });
        toast.warning('Server unreachable or returned an error.');
      }
    } catch (err) {
      setTestResult({ success: false, message: `Connection failed: ${err.message}` });
      toast.error('Connection test failed.');
    } finally {
      setIsTesting(false);
    }
  };


  const handleClearLocalCache = () => {
    localStorage.removeItem('taskflow_tasks_cache');
    toast.success('Local cache cleared. Reloading from server...');
    refreshTasks();
  };

  return (
    <div className="page-container settings-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Application Settings</h1>
          <p className="page-subheading">
            Configure REST API endpoints, UI appearance, and data synchronization.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* API Endpoint Configuration */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Task 3 REST API Endpoint</h2>
              <p className="section-subtitle">Manage connection to the backend service</p>
            </div>
          </div>

          <form onSubmit={handleSaveApiUrl} className="settings-form">
            <div className="form-group">
              <label htmlFor="api-url-input" className="form-label">
                API Base URL
              </label>
              <input
                id="api-url-input"
                type="url"
                className="form-input"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://task-manager-api-dplt.onrender.com/api"
                required
              />
              <span className="form-hint">
                Default: <code>https://task-manager-api-dplt.onrender.com/api</code>
              </span>
            </div>

            {testResult && (
              <div className={`connection-test-result ${testResult.success ? 'test-pass' : 'test-fail'}`}>
                {testResult.success ? '✓ ' : '✕ '}
                {testResult.message}
              </div>
            )}

            <div className="settings-actions-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <span className="spinner-small"></span> Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </button>
              <div className="btn-group-right">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleResetApiUrl}
                >
                  Reset Default
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Endpoint
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Appearance Settings */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Appearance & Theme</h2>
              <p className="section-subtitle">Customize the interface color theme</p>
            </div>
          </div>

          <div className="theme-toggle-section">
            <div className="theme-option-info">
              <span className="theme-option-title">Theme Mode</span>
              <span className="theme-option-desc">
                Current mode: <strong>{isDark ? 'Dark Mode' : 'Light Mode'}</strong>
              </span>
            </div>
            <button className="btn btn-secondary" onClick={toggleTheme}>
              {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
            </button>
          </div>
        </div>

        {/* Data & Cache Management */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Data & Cache</h2>
              <p className="section-subtitle">Manage offline cache and synchronize state</p>
            </div>
          </div>

          <div className="cache-management-row">
            <div>
              <span className="theme-option-title">Local Tasks Cache</span>
              <p className="theme-option-desc">
                Clear locally cached tasks and refetch fresh data from the server.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleClearLocalCache}>
              Clear Cache & Sync
            </button>
          </div>
        </div>

        {/* Architecture & Student Info */}
        <div className="card settings-card info-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Project & System Architecture</h2>
              <p className="section-subtitle">YR NOVATECH Internship • Task 5 Submission</p>
            </div>
          </div>

          <div className="system-info-table">
            <div className="info-row">
              <span className="info-label">Application:</span>
              <span className="info-val">TaskFlow Dashboard v2.0 (React SPA)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Framework / Bundler:</span>
              <span className="info-val">React 18 + Vite 6</span>
            </div>
            <div className="info-row">
              <span className="info-label">Routing:</span>
              <span className="info-val">React Router v6 (Client-side)</span>
            </div>
            <div className="info-row">
              <span className="info-label">State Management:</span>
              <span className="info-val">React Context API (TaskContext, ThemeContext, ToastContext)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Backend REST API:</span>
              <span className="info-val">Task 3 Express API on Render</span>
            </div>
            <div className="info-row">
              <span className="info-label">Student:</span>
              <span className="info-val">Ansh Jaiswal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
