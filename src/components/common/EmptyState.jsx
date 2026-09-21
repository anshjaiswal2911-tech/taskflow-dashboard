import React from 'react';

export default function EmptyState({ 
  type = 'no-tasks', 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon,
  actionButton,
  secondaryButton 
}) {
  const defaultIcon = type === 'search' ? (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ) : (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );

  return (
    <div className="empty-state">
      <div className="empty-icon-circle">
        {icon || defaultIcon}
      </div>
      <h3 className="empty-title">{title || (type === 'search' ? 'No matching tasks' : 'No tasks found')}</h3>
      <p className="empty-description">
        {description || (type === 'search' ? 'Try adjusting your search or filters.' : 'Get started by creating your first task.')}
      </p>

      {(actionButton || secondaryButton || (actionLabel && onAction)) && (
        <div className="empty-actions">
          {actionButton || (actionLabel && onAction && (
            <button className="btn btn-primary" onClick={onAction}>
              {actionLabel}
            </button>
          ))}
          {secondaryButton}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
