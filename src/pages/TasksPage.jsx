import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskToolbar from '../components/tasks/TaskToolbar';
import TaskCard from '../components/tasks/TaskCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

export default function TasksPage() {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    refreshTasks
  } = useTasks();

  const { onOpenCreateModal, onOpenEditModal, onOpenDeleteModal, onToggleComplete } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const hasActiveFilters = searchQuery !== '' || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterPriority('all');
  };

  return (
    <div className="page-container tasks-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Tasks Management</h1>
          <p className="page-subheading">
            Manage, organize, filter, and track all tasks in real-time.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={onOpenCreateModal}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar with tabs, category/priority filters, sorting, view switch */}
      <TaskToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="filters-label">Active filters:</span>
          {searchQuery && (
            <span className="filter-chip">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">&times;</button>
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="filter-chip">
              Status: {filterStatus}
              <button onClick={() => setFilterStatus('all')} aria-label="Remove status filter">&times;</button>
            </span>
          )}
          {filterCategory !== 'all' && (
            <span className="filter-chip">
              Category: {filterCategory}
              <button onClick={() => setFilterCategory('all')} aria-label="Remove category filter">&times;</button>
            </span>
          )}
          {filterPriority !== 'all' && (
            <span className="filter-chip">
              Priority: {filterPriority}
              <button onClick={() => setFilterPriority('all')} aria-label="Remove priority filter">&times;</button>
            </span>
          )}
          <button className="btn-link-reset" onClick={resetAllFilters}>
            Clear all filters
          </button>
        </div>
      )}

      {/* API Error State */}
      {error && (
        <div className="api-error-banner">
          <div className="error-banner-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>API Error:</strong> {error}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={refreshTasks}>
            Retry
          </button>
        </div>
      )}

      {/* Task List / Grid Display */}
      <div className="tasks-content-area">
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : filteredTasks.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              type="search"
              title="No matching tasks found"
              description="No tasks match your current filter and search criteria. Try clearing some filters."
              actionLabel="Reset Filters"
              onAction={resetAllFilters}
            />
          ) : (
            <EmptyState
              type="no-tasks"
              title="No tasks yet"
              description="Get started by creating your first task. It will be synced with the cloud REST API."
              actionLabel="Create First Task"
              onAction={onOpenCreateModal}
            />
          )
        ) : (
          <div className={viewMode === 'grid' ? 'tasks-grid-layout' : 'tasks-list-layout'}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
