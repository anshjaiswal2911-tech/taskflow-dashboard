import React from 'react';

const CATEGORY_COLORS = {
  Development: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
  Design: { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.2)' },
  Marketing: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
  Operations: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  General: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.2)' }
};

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';
  const categoryStyle = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.General;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-card-main">
        <label className="custom-checkbox" title={isCompleted ? "Mark as pending" : "Mark as completed"}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(task)}
            aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          />
          <span className="checkbox-indicator">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <polyline points="1.5 5.5 4.5 8.5 10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </label>

        <div className="task-card-content">
          <div className="task-card-header">
            <h3 className="task-title" title={task.title}>{task.title}</h3>
            <span className={`badge-priority badge-${task.priority}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-card-meta">
            <span 
              className="task-category-tag" 
              style={{ 
                backgroundColor: categoryStyle.bg, 
                color: categoryStyle.text, 
                borderColor: categoryStyle.border 
              }}
            >
              {task.category}
            </span>

            {task.dueDate && (
              <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {formatDate(task.dueDate)}
                {isOverdue() && <span className="overdue-label">Overdue</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-card-actions">
        <button
          className="btn-icon"
          title="Edit task"
          aria-label="Edit task"
          onClick={() => onEdit(task)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button
          className="btn-icon btn-icon-danger"
          title="Delete task"
          aria-label="Delete task"
          onClick={() => onDelete(task)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
