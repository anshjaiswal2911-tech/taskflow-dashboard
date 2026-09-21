import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { taskService } from '../api/taskService';
import { useToast } from './ToastContext';

const TaskContext = createContext(null);
const STORAGE_KEY_VIEW_MODE = 'taskflow_view_mode';

export function TaskProvider({ children }) {
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('connecting'); // 'online' | 'offline' | 'connecting'
  const [apiLatency, setApiLatency] = useState(null);

  // Filter & view preferences
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all' | 'active' | 'completed' | 'high'
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_VIEW_MODE) || 'list';
  });

  // Load tasks from API
  const fetchTasks = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    setApiStatus('connecting');

    try {
      const startTime = Date.now();
      const fetchedTasks = await taskService.getTasks();
      const latency = Date.now() - startTime;

      setTasks(fetchedTasks);
      setApiStatus('online');
      setApiLatency(latency);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks from API:', err);
      setApiStatus('offline');
      setError(err.message || 'Failed to connect to the REST API.');
      if (!isSilent) {
        addToast(err.message || 'Unable to connect to REST API', 'danger');
      }
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Persist view mode
  const updateViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode);
  };

  // Create Task
  const createTask = async (taskData) => {
    try {
      const created = await taskService.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      addToast('Task created successfully!', 'success');
      return { success: true, task: created };
    } catch (err) {
      console.error('Create task error:', err);
      addToast(err.message || 'Failed to create task on server', 'danger');
      return { success: false, error: err.message };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const updated = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      addToast('Task updated successfully!', 'success');
      return { success: true, task: updated };
    } catch (err) {
      console.error('Update task error:', err);
      addToast(err.message || 'Failed to update task', 'danger');
      return { success: false, error: err.message };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast('Task deleted successfully', 'danger');
      return { success: true };
    } catch (err) {
      console.error('Delete task error:', err);
      addToast(err.message || 'Failed to delete task', 'danger');
      return { success: false, error: err.message };
    }
  };

  // Toggle Task Completion
  const toggleTaskStatus = async (id) => {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    const newCompleted = !existing.completed;
    const newStatus = newCompleted ? 'completed' : 'pending';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: newCompleted, status: newStatus } : t
      )
    );

    try {
      const updated = await taskService.updateTask(id, {
        ...existing,
        completed: newCompleted,
        status: newStatus
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      addToast(newCompleted ? 'Task completed! 🎉' : 'Task marked as in progress', 'success');
    } catch (err) {
      console.error('Toggle status error:', err);
      // Revert optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: existing.completed, status: existing.status } : t
        )
      );
      addToast(err.message || 'Failed to update task status on server', 'danger');
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setCurrentFilter('all');
    setCurrentCategory('all');
    setSearchQuery('');
  };

  // Computed: Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // 1. Status Filter
    if (currentFilter === 'active') {
      list = list.filter((t) => !t.completed);
    } else if (currentFilter === 'completed') {
      list = list.filter((t) => t.completed);
    } else if (currentFilter === 'high') {
      list = list.filter((t) => t.priority === 'High');
    }

    // 2. Category Filter
    if (currentCategory !== 'all') {
      list = list.filter(
        (t) => t.category && t.category.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    // 3. Search Query Filter
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const title = (t.title || '').toLowerCase();
        const desc = (t.description || '').toLowerCase();
        const cat = (t.category || '').toLowerCase();
        return title.includes(query) || desc.includes(query) || cat.includes(query);
      });
    }

    // 4. Sorting
    list.sort((a, b) => {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;

      switch (sortBy) {
        case 'date-asc':
          return (timeA || 0) - (timeB || 0);
        case 'date-desc':
          return (timeB || 0) - (timeA || 0);
        case 'priority-desc': {
          const weights = { High: 3, Medium: 2, Low: 1 };
          const diff = (weights[b.priority] || 0) - (weights[a.priority] || 0);
          if (diff !== 0) return diff;
          return (timeA || 0) - (timeB || 0);
        }
        case 'created-desc': {
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return createdB - createdA;
        }
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return list;
  }, [tasks, currentFilter, currentCategory, searchQuery, sortBy]);

  // Computed: Dynamic Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    const mediumPriority = tasks.filter((t) => t.priority === 'Medium').length;
    const lowPriority = tasks.filter((t) => t.priority === 'Low').length;
    const completionPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const categories = ['Work', 'Personal', 'Development', 'Design'];
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = tasks.filter((t) => t.category && t.category.toLowerCase() === cat.toLowerCase()).length;
      return acc;
    }, {});

    return {
      total,
      pending,
      completed,
      highPriority,
      mediumPriority,
      lowPriority,
      completionPercent,
      categoryCounts
    };
  }, [tasks]);

  const value = {
    tasks,
    loading,
    error,
    apiStatus,
    apiLatency,
    currentFilter,
    currentCategory,
    searchQuery,
    sortBy,
    viewMode,
    filteredTasks,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setCurrentFilter,
    setCurrentCategory,
    setSearchQuery,
    setSortBy,
    setViewMode: updateViewMode,
    resetFilters
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
