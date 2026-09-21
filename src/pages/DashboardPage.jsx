import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskStats from '../components/tasks/TaskStats';
import TaskCard from '../components/tasks/TaskCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

export default function DashboardPage() {
  const { tasks, loading, error, refreshTasks, stats } = useTasks();
  const { onOpenCreateModal, onOpenEditModal, onOpenDeleteModal, onToggleComplete } = useOutletContext();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Top 5 upcoming / pending tasks
  const pendingTasks = tasks.filter(t => t.status === 'pending').slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="page-container dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <span className="welcome-date">{currentDate}</span>
          <h1 className="page-heading">Dashboard Overview</h1>
          <p className="page-subheading">
            Track, prioritize, and manage team deliverables connected directly to the Task 3 cloud API.
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <TaskStats />

      {/* Error state alert with retry */}
      {error && (
        <div className="api-error-banner">
          <div className="error-banner-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Failed to sync with API server:</strong> {error}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={refreshTasks}>
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content Sections: Left (Upcoming Tasks) & Right (Quick Stats/Overview) */}
      <div className="dashboard-grid">
        <div className="dashboard-main-col">
          <div className="card section-card">
            <div className="section-card-header">
              <div>
                <h2 className="section-title">Active Priorities</h2>
                <p className="section-subtitle">Pending tasks requiring immediate attention</p>
              </div>
              <Link to="/tasks" className="link-view-all">
                View All ({stats.total}) &rarr;
              </Link>
            </div>

            <div className="section-card-body">
              {loading ? (
                <LoadingSkeleton count={3} />
              ) : pendingTasks.length === 0 ? (
                <EmptyState
                  type="no-tasks"
                  title="All caught up!"
                  description="You have no pending tasks. Great job staying on top of your work."
                  actionLabel="Add New Task"
                  onAction={onOpenCreateModal}
                />
              ) : (
                <div className="task-list">
                  {pendingTasks.map((task) => (
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
        </div>

        <div className="dashboard-side-col">
          {/* Progress Goal Summary Card */}
          <div className="card goal-overview-card">
            <h3 className="widget-title">Sprint Completion</h3>
            <div className="goal-meter-wrapper">
              <div className="goal-meter-circle">
                <span className="goal-meter-value">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
                <span className="goal-meter-label">Done</span>
              </div>
            </div>
            <div className="goal-metrics-row">
              <div className="metric-box">
                <span className="metric-num">{stats.completed}</span>
                <span className="metric-tag">Completed</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">{stats.pending}</span>
                <span className="metric-tag">In Progress</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">{stats.highPriority}</span>
                <span className="metric-tag">High Priority</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card quick-links-card">
            <h3 className="widget-title">Quick Actions</h3>
            <div className="quick-actions-list">
              <button className="quick-action-btn" onClick={onOpenCreateModal}>
                <span className="action-icon action-icon-blue">+</span>
                <span>Add new team deliverable</span>
              </button>
              <Link to="/analytics" className="quick-action-btn">
                <span className="action-icon action-icon-emerald">📊</span>
                <span>View productivity analytics</span>
              </Link>
              <Link to="/settings" className="quick-action-btn">
                <span className="action-icon action-icon-amber">⚙️</span>
                <span>Configure REST API endpoint</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
