/**
 * Task Service Layer
 * Encapsulates all REST API interactions for tasks with normalization between backend and frontend models.
 */

import { request, getApiBaseUrl } from './apiClient';

/**
 * Normalizes an API task entity into the client's model.
 */
export function normalizeTask(task) {
  if (!task) return null;

  const rawStatus = (task.status || 'pending').toLowerCase();
  const isCompleted = rawStatus === 'completed';

  const rawPriority = (task.priority || 'low').toLowerCase();
  const capitalizedPriority =
    rawPriority === 'high' ? 'High' : rawPriority === 'medium' ? 'Medium' : 'Low';

  const rawCategory = task.category || 'Work';
  const validCategories = ['Work', 'Personal', 'Development', 'Design'];
  const matchedCategory =
    validCategories.find(c => c.toLowerCase() === rawCategory.toLowerCase()) || rawCategory;

  let dueDate = task.dueDate || task.due_date || '';
  if (dueDate && dueDate.includes('T')) {
    dueDate = dueDate.split('T')[0];
  } else if (dueDate && dueDate.includes(' ')) {
    dueDate = dueDate.split(' ')[0];
  }

  return {
    id: task.id,
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: rawStatus,
    completed: isCompleted,
    priority: capitalizedPriority,
    category: matchedCategory,
    dueDate: dueDate,
    createdAt: task.created_at || task.createdAt || new Date().toISOString(),
    updatedAt: task.updated_at || task.updatedAt || new Date().toISOString()
  };
}

/**
 * Prepares client task data for API payload.
 */
export function formatTaskPayload(clientData) {
  const isCompleted = clientData.completed !== undefined ? clientData.completed : false;
  const status = clientData.status
    ? clientData.status.toLowerCase()
    : isCompleted
    ? 'completed'
    : 'pending';

  return {
    title: (clientData.title || '').trim(),
    description: (clientData.description || '').trim(),
    status: status,
    priority: (clientData.priority || 'low').toLowerCase(),
    category: clientData.category || 'Work',
    due_date: clientData.dueDate || clientData.due_date || null
  };
}

export const taskService = {
  /**
   * Fetch all tasks from GET /tasks
   */
  async getTasks() {
    const res = await request('/tasks');
    const rawList = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
    return rawList.map(normalizeTask);
  },

  /**
   * Fetch single task by ID from GET /tasks/:id
   */
  async getTaskById(id) {
    const res = await request(`/tasks/${id}`);
    const taskData = res.data ? res.data : res;
    return normalizeTask(taskData);
  },

  /**
   * Create new task with POST /tasks
   */
  async createTask(taskData) {
    const payload = formatTaskPayload(taskData);
    const res = await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const created = res.data ? res.data : res;
    return normalizeTask(created);
  },

  /**
   * Update existing task with PUT /tasks/:id
   */
  async updateTask(id, taskData) {
    const payload = formatTaskPayload(taskData);
    const res = await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    const updated = res.data ? res.data : res;
    return normalizeTask(updated);
  },

  /**
   * Delete task with DELETE /tasks/:id
   */
  async deleteTask(id) {
    const res = await request(`/tasks/${id}`, {
      method: 'DELETE'
    });
    return res;
  },

  /**
   * Test connection & probe API health
   */
  async checkHealth() {
    const startTime = Date.now();
    try {
      const res = await request('/tasks', { timeout: 8000 });
      const latency = Date.now() - startTime;
      return {
        online: true,
        latency,
        baseUrl: getApiBaseUrl(),
        message: 'Connected successfully'
      };
    } catch (err) {
      return {
        online: false,
        latency: Date.now() - startTime,
        baseUrl: getApiBaseUrl(),
        message: err.message || 'Unable to connect'
      };
    }
  }
};

export default taskService;


