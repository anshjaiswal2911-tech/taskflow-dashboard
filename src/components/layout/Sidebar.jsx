import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';

export default function Sidebar({ isOpen, onClose }) {
  const { stats, setFilterCategory } = useTasks();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setFilterCategory(category);
    navigate('/tasks');
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">TaskFlow</span>
              <span className="brand-tag">v2.0 • API SPA</span>
            </div>
          </div>
          <button className="btn-icon mobile-close-btn" onClick={onClose} aria-label="Close navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN NAVIGATION</div>
          <ul className="nav-list">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span>Tasks</span>
                {stats.pending > 0 && (
                  <span className="nav-badge">{stats.pending}</span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Analytics</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>

          <div className="nav-section-title">CATEGORIES</div>
          <ul className="category-quick-list">
            <li>
              <button className="category-item-btn" onClick={() => handleCategoryClick('Development')}>
                <span className="cat-dot cat-dev"></span>
                <span>Development</span>
              </button>
            </li>
            <li>
              <button className="category-item-btn" onClick={() => handleCategoryClick('Design')}>
                <span className="cat-dot cat-design"></span>
                <span>Design</span>
              </button>
            </li>
            <li>
              <button className="category-item-btn" onClick={() => handleCategoryClick('Marketing')}>
                <span className="cat-dot cat-marketing"></span>
                <span>Marketing</span>
              </button>
            </li>
            <li>
              <button className="category-item-btn" onClick={() => handleCategoryClick('Operations')}>
                <span className="cat-dot cat-ops"></span>
                <span>Operations</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer Goal Card */}
        <div className="sidebar-footer">
          <div className="goal-card">
            <div className="goal-header">
              <span className="goal-title">Completion Rate</span>
              <span className="goal-percent">{completionPercentage}%</span>
            </div>
            <div className="goal-progress-bar">
              <div 
                className="goal-progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="goal-subtext">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
