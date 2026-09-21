import React from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskToolbar({ viewMode, onViewModeChange }) {
  const {
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    stats
  } = useTasks();

  const statusTabs = [
    { id: 'all', label: 'All Tasks', count: stats.total },
    { id: 'pending', label: 'In Progress', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="task-toolbar">
      {/* Filter Tabs */}
      <div className="toolbar-tabs" role="tablist">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={filterStatus === tab.id}
            className={`toolbar-tab ${filterStatus === tab.id ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Controls: Category, Priority, Sort, View Toggle */}
      <div className="toolbar-controls">
        {/* Category Filter */}
        <div className="select-wrapper">
          <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
          <select
            id="category-filter"
            className="form-select toolbar-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="select-wrapper">
          <label htmlFor="priority-filter" className="sr-only">Filter by Priority</label>
          <select
            id="priority-filter"
            className="form-select toolbar-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Sort */}
        <div className="select-wrapper">
          <label htmlFor="sort-select" className="sr-only">Sort Tasks</label>
          <select
            id="sort-select"
            className="form-select toolbar-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="due_asc">Due Date (Earliest)</option>
            <option value="due_desc">Due Date (Latest)</option>
            <option value="priority_desc">Priority (High to Low)</option>
            <option value="title_asc">Title (A-Z)</option>
          </select>
        </div>

        {/* View Mode Toggle (List vs Grid) */}
        {onViewModeChange && (
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`btn-icon view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
              aria-label="List View"
              onClick={() => onViewModeChange('list')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button
              type="button"
              className={`btn-icon view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
              aria-label="Grid View"
              onClick={() => onViewModeChange('grid')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
