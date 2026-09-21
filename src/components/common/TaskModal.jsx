import React, { useState, useEffect, useRef } from 'react';

export default function TaskModal({ 
  isOpen, 
  task, 
  initialData, 
  onClose, 
  onSave, 
  onSubmit, 
  isSubmitting = false 
}) {
  const currentTask = task || initialData;
  const saveHandler = onSave || onSubmit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Development');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const titleInputRef = useRef(null);

  // Helper to get tomorrow's date formatted YYYY-MM-DD
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
      if (currentTask) {
        setTitle(currentTask.title || '');
        setDescription(currentTask.description || '');
        setPriority((currentTask.priority || 'medium').toLowerCase());
        setCategory(currentTask.category || 'Development');
        setDueDate(currentTask.dueDate ? currentTask.dueDate.split('T')[0] : getDefaultDueDate());
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('Development');
        setDueDate(getDefaultDueDate());
      }
      setErrors({});

      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, currentTask]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a task title.';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Please select a valid due date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (saveHandler) {
      await saveHandler({
        title: title.trim(),
        description: description.trim(),
        priority: priority.toLowerCase(),
        category,
        dueDate
      });
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {currentTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title */}
          <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
            <label htmlFor="taskTitle" className="form-label">
              Task Title <span className="required">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="taskTitle"
              className="form-input"
              placeholder="e.g. Integrate REST API endpoints"
              value={title}
              maxLength={120}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              required
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="taskDesc" className="form-label">Description</label>
            <textarea
              id="taskDesc"
              className="form-textarea"
              rows={3}
              placeholder="Provide context, acceptance criteria, or details..."
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row: Priority & Category */}
          <div className="form-row">
            {/* Priority Selector */}
            <div className="form-group">
              <label className="form-label">Priority <span className="required">*</span></label>
              <div className="priority-selector" role="radiogroup">
                {[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ].map((p) => (
                  <label key={p.value} className={`priority-option option-${p.value}`}>
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      checked={priority === p.value}
                      onChange={() => setPriority(p.value)}
                    />
                    <span className="priority-pill">
                      <span className="priority-indicator" />
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="taskCategory" className="form-label">Category <span className="required">*</span></label>
              <div className="select-wrapper">
                <select
                  id="taskCategory"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className={`form-group ${errors.dueDate ? 'has-error' : ''}`}>
            <label htmlFor="taskDueDate" className="form-label">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="taskDueDate"
              className="form-input"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
              }}
              required
            />
            {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span> Saving...
                </>
              ) : currentTask ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { TaskModal };
