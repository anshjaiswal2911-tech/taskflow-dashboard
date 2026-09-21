import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskStats from '../components/tasks/TaskStats';

export default function AnalyticsPage() {
  const { tasks, stats, apiStatus } = useTasks();

  // Category counts and completion rates
  const categories = ['Development', 'Design', 'Marketing', 'Operations', 'General'];
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const completed = catTasks.filter((t) => t.status === 'completed').length;
    const total = catTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: cat, total, completed, pending: total - completed, rate };
  });

  // Priority breakdown
  const priorityStats = [
    { name: 'High', count: stats.highPriority, color: 'var(--color-rose-500)', bg: 'rgba(239, 68, 68, 0.15)' },
    { name: 'Medium', count: stats.mediumPriority, color: 'var(--color-amber-500)', bg: 'rgba(245, 158, 11, 0.15)' },
    { name: 'Low', count: stats.lowPriority, color: 'var(--color-emerald-500)', bg: 'rgba(16, 185, 129, 0.15)' }
  ];

  // Overdue count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < today;
  }).length;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="page-container analytics-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Productivity & Analytics</h1>
          <p className="page-subheading">
            Live velocity metrics, category distributions, and task completion analytics.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <TaskStats />

      {/* Analytics Main Grid */}
      <div className="analytics-grid">
        {/* Category Breakdown Card */}
        <div className="card analytics-card">
          <div className="analytics-card-header">
            <h2 className="section-title">Distribution by Category</h2>
            <span className="badge badge-neutral">{categories.length} Categories</span>
          </div>

          <div className="category-bars-list">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="cat-bar-item">
                <div className="cat-bar-info">
                  <span className="cat-bar-title">{cat.name}</span>
                  <span className="cat-bar-stats">
                    {cat.completed}/{cat.total} completed ({cat.rate}%)
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill cat-fill" 
                    style={{ width: `${cat.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="card analytics-card">
          <div className="analytics-card-header">
            <h2 className="section-title">Priority Breakdown</h2>
            <span className="badge badge-neutral">{stats.total} Total</span>
          </div>

          <div className="priority-breakdown-list">
            {priorityStats.map((p) => {
              const pct = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
              return (
                <div key={p.name} className="priority-stat-row">
                  <div className="priority-stat-info">
                    <span className="priority-bullet" style={{ backgroundColor: p.color }}></span>
                    <span className="priority-name">{p.name} Priority</span>
                  </div>
                  <div className="priority-stat-value">
                    <strong>{p.count}</strong> tasks ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="analytics-divider"></div>

          <div className="status-metric-highlight">
            <div className="highlight-item">
              <span className="highlight-label">Completion Velocity</span>
              <span className="highlight-val text-emerald">{completionRate}%</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Overdue Tasks</span>
              <span className={`highlight-val ${overdueCount > 0 ? 'text-rose' : 'text-muted'}`}>
                {overdueCount}
              </span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">API Health</span>
              <span className={`highlight-val ${apiStatus === 'connected' ? 'text-emerald' : 'text-amber'}`}>
                {apiStatus === 'connected' ? 'Online' : apiStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
