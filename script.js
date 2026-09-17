/**
 * TaskFlow – Task Management Dashboard
 * Pure Vanilla JavaScript (ES6+)
 * 
 * Features:
 * - Full CRUD Task Management (Create, Read, Update, Delete, Toggle Complete)
 * - Dynamic Dashboard Statistics & Productivity Progress
 * - Multi-criteria Filtering (Status, Category, Priority, Search Query)
 * - Custom Sorting (Due Date, Priority, Created Date, Alphabetical)
 * - Responsive Layout & Mobile Drawer
 * - LocalStorage State Persistence (Tasks, Theme, View Mode)
 * - Non-blocking Toast Notifications
 * - Accessible Modal Dialogs
 * - Light & Dark Theme Support
 */

'use strict';

// ==========================================================================
// 1. Initial State & Constants
// ==========================================================================
const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  THEME: 'taskflow_theme',
  VIEW_MODE: 'taskflow_view_mode'
};

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Design System Documentation & Tokens',
    description: 'Document color palettes, typography scale, spacing tokens, and component guidelines in Figma.',
    priority: 'High',
    category: 'Design',
    dueDate: getRelativeDate(1), // Tomorrow
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'task-2',
    title: 'Implement Dark/Light Mode Theme Switcher',
    description: 'Use CSS custom properties and localStorage to support seamless theme switching with system detection.',
    priority: 'High',
    category: 'Development',
    dueDate: getRelativeDate(0), // Today
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'task-3',
    title: 'Prepare Sprint Review Slide Deck',
    description: 'Compile key milestone achievements, velocity metrics, and feature roadmap for the team presentation.',
    priority: 'Medium',
    category: 'Work',
    dueDate: getRelativeDate(3),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'task-4',
    title: 'Schedule Weekly Team 1-on-1 Syncs',
    description: 'Set up bi-weekly feedback and project alignment meetings with engineering and design leads.',
    priority: 'Low',
    category: 'Work',
    dueDate: getRelativeDate(5),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'task-5',
    title: 'Grocery Shopping & Meal Prep',
    description: 'Pick up fresh groceries, vegetables, and meal prep lunches for the upcoming week.',
    priority: 'Low',
    category: 'Personal',
    dueDate: getRelativeDate(2),
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// Helper to get formatted YYYY-MM-DD date relative to today
function getRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// Global App State
const state = {
  tasks: [],
  currentFilter: 'all', // 'all' | 'active' | 'completed' | 'high'
  currentCategory: 'all', // 'all' | 'Work' | 'Personal' | 'Development' | 'Design'
  searchQuery: '',
  sortBy: 'date-asc',
  viewMode: 'list', // 'list' | 'grid'
  editingTaskId: null,
  taskToDeleteId: null
};

// ==========================================================================
// 2. DOM Elements
// ==========================================================================
const elements = {
  // Theme & Layout
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
  currentDateDisplay: document.getElementById('dateText'),

  // Views & Controls
  viewListBtn: document.getElementById('viewListBtn'),
  viewGridBtn: document.getElementById('viewGridBtn'),
  taskContainer: document.getElementById('taskContainer'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyDescription: document.getElementById('emptyDescription'),
  emptyResetFilterBtn: document.getElementById('emptyResetFilterBtn'),
  emptyNewTaskBtn: document.getElementById('emptyNewTaskBtn'),
  filterInfoBar: document.getElementById('filterInfoBar'),
  filterSummaryText: document.getElementById('filterSummaryText'),
  clearAllFiltersBtn: document.getElementById('clearAllFiltersBtn'),

  // Search & Filters
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortBySelect: document.getElementById('sortBySelect'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  sidebarNavLinks: document.querySelectorAll('.sidebar-nav .nav-link[data-filter]'),
  categoryLinks: document.querySelectorAll('.category-link'),

  // Stats & Badges
  statTotal: document.getElementById('statTotal'),
  statPending: document.getElementById('statPending'),
  statCompleted: document.getElementById('statCompleted'),
  statHigh: document.getElementById('statHigh'),
  statCompletedSub: document.getElementById('statCompletedSub'),
  badgeAll: document.getElementById('badgeAll'),
  badgeActive: document.getElementById('badgeActive'),
  badgeCompleted: document.getElementById('badgeCompleted'),
  badgeHigh: document.getElementById('badgeHigh'),
  tabCountAll: document.getElementById('tabCountAll'),
  tabCountActive: document.getElementById('tabCountActive'),
  tabCountCompleted: document.getElementById('tabCountCompleted'),
  tabCountHigh: document.getElementById('tabCountHigh'),
  sidebarProgressPercent: document.getElementById('sidebarProgressPercent'),
  sidebarProgressBar: document.getElementById('sidebarProgressBar'),
  sidebarProgressText: document.getElementById('sidebarProgressText'),
  resetDemoBtn: document.getElementById('resetDemoBtn'),

  // Task Modal (Create / Edit)
  taskModal: document.getElementById('taskModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalCancelBtn: document.getElementById('modalCancelBtn'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskDescInput: document.getElementById('taskDescInput'),
  taskCategorySelect: document.getElementById('taskCategorySelect'),
  taskDueDateInput: document.getElementById('taskDueDateInput'),
  titleError: document.getElementById('titleError'),
  dueDateError: document.getElementById('dueDateError'),
  headerNewTaskBtn: document.getElementById('headerNewTaskBtn'),
  sidebarNewTaskBtn: document.getElementById('sidebarNewTaskBtn'),

  // Delete Confirmation Modal
  deleteModal: document.getElementById('deleteModal'),
  deleteTaskTitle: document.getElementById('deleteTaskTitle'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// 3. Application Initialization
// ==========================================================================
function initApp() {
  initTheme();
  initDateDisplay();
  loadStoredPreferences();
  loadTasks();
  setupEventListeners();
  updateUI();
}

// --------------------------------------------------------------------------
// Date & Theme Management
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    elements.html.setAttribute('data-theme', savedTheme);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    elements.html.setAttribute('data-theme', initialTheme);
  }
}

function toggleTheme() {
  const currentTheme = elements.html.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  elements.html.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
}

function initDateDisplay() {
  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  elements.currentDateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

// --------------------------------------------------------------------------
// Storage & State Loading
// --------------------------------------------------------------------------
function loadStoredPreferences() {
  const savedView = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
  if (savedView === 'grid' || savedView === 'list') {
    setViewMode(savedView);
  }
}

function loadTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        state.tasks = parsed;
      } else {
        state.tasks = [...DEFAULT_TASKS];
        saveTasksToStorage();
      }
    } else {
      // First visit: Seed default demo data
      state.tasks = [...DEFAULT_TASKS];
      saveTasksToStorage();
    }
  } catch (error) {
    console.error('Error reading localStorage tasks:', error);
    state.tasks = [...DEFAULT_TASKS];
  }
}

function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    showToast('Failed to save changes to storage', 'danger');
  }
}

// ==========================================================================
// 4. Task CRUD Operations
// ==========================================================================
function createTask(taskData) {
  const newTask = {
    id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    priority: taskData.priority || 'Low',
    category: taskData.category || 'Work',
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.unshift(newTask);
  saveTasksToStorage();
  updateUI();
  showToast('Task created successfully!', 'success');
}

function updateTask(id, updatedData) {
  const index = state.tasks.findIndex(t => t.id === id);
  if (index === -1) return;

  state.tasks[index] = {
    ...state.tasks[index],
    title: updatedData.title.trim(),
    description: updatedData.description ? updatedData.description.trim() : '',
    priority: updatedData.priority || 'Low',
    category: updatedData.category || 'Work',
    dueDate: updatedData.dueDate
  };

  saveTasksToStorage();
  updateUI();
  showToast('Task updated successfully!', 'success');
}

function deleteTask(id) {
  const task = state.tasks.find(t => t.id === id);
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveTasksToStorage();
  updateUI();
  showToast(`Deleted "${task ? task.title : 'task'}"`, 'danger');
}

function toggleTaskStatus(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasksToStorage();
  updateUI();

  if (task.completed) {
    showToast(`Task completed! 🎉`, 'success');
  } else {
    showToast(`Task moved back to active`, 'info');
  }
}

function resetDemoData() {
  state.tasks = [...DEFAULT_TASKS];
  state.currentFilter = 'all';
  state.currentCategory = 'all';
  state.searchQuery = '';
  elements.searchInput.value = '';
  elements.clearSearchBtn.style.display = 'none';
  elements.categoryFilter.value = 'all';
  saveTasksToStorage();
  updateUI();
  showToast('Sample tasks restored!', 'info');
}

// ==========================================================================
// 5. Filtering, Sorting & Rendering Logic
// ==========================================================================
function getFilteredAndSortedTasks() {
  let list = [...state.tasks];

  // 1. Status Filter
  if (state.currentFilter === 'active') {
    list = list.filter(t => !t.completed);
  } else if (state.currentFilter === 'completed') {
    list = list.filter(t => t.completed);
  } else if (state.currentFilter === 'high') {
    list = list.filter(t => t.priority === 'High');
  }

  // 2. Category Filter
  if (state.currentCategory !== 'all') {
    list = list.filter(t => t.category && t.category.toLowerCase() === state.currentCategory.toLowerCase());
  }

  // 3. Search Query Filter (Safe string handling)
  if (state.searchQuery && state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase().trim();
    list = list.filter(t => {
      const title = (t.title || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      return title.includes(query) || desc.includes(query) || cat.includes(query);
    });
  }

  // 4. Sorting with deterministic tie-breakers and invalid date protection
  list.sort((a, b) => {
    const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;

    switch (state.sortBy) {
      case 'date-asc':
        return (timeA || 0) - (timeB || 0);
      case 'date-desc':
        return (timeB || 0) - (timeA || 0);
      case 'priority-desc': {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        const diff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
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
}

function updateUI() {
  updateStatistics();
  updateNavigationStates();
  renderTasks();
}

function updateStatistics() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = state.tasks.filter(t => t.priority === 'High').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Stats KPI cards
  elements.statTotal.textContent = total;
  elements.statPending.textContent = pending;
  elements.statCompleted.textContent = completed;
  elements.statHigh.textContent = highPriority;
  elements.statCompletedSub.textContent = `${percent}% completion rate`;

  // Sidebar badges
  elements.badgeAll.textContent = total;
  elements.badgeActive.textContent = pending;
  elements.badgeCompleted.textContent = completed;
  elements.badgeHigh.textContent = highPriority;

  // Filter tab badges
  elements.tabCountAll.textContent = total;
  elements.tabCountActive.textContent = pending;
  elements.tabCountCompleted.textContent = completed;
  elements.tabCountHigh.textContent = highPriority;

  // Productivity Goal Bar
  elements.sidebarProgressPercent.textContent = `${percent}%`;
  elements.sidebarProgressBar.style.width = `${percent}%`;
  elements.sidebarProgressText.textContent = `${completed} of ${total} tasks completed`;
}

function updateNavigationStates() {
  // Sync Sidebar active state
  elements.sidebarNavLinks.forEach(link => {
    const filter = link.getAttribute('data-filter');
    if (filter === state.currentFilter) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sync Tab Buttons active state
  elements.filterTabs.forEach(tab => {
    const filter = tab.getAttribute('data-filter');
    const isSelected = filter === state.currentFilter;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', isSelected);
  });

  // Sync Category Links
  elements.categoryLinks.forEach(link => {
    const cat = link.getAttribute('data-category');
    if (cat === state.currentCategory) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sync Category Select Dropdown
  if (elements.categoryFilter.value !== state.currentCategory) {
    elements.categoryFilter.value = state.currentCategory;
  }

  // Active Filter Summary Banner (avoid double HTML escaping in textContent)
  const hasActiveFilters = state.currentFilter !== 'all' || state.currentCategory !== 'all' || (state.searchQuery && state.searchQuery.trim() !== '');
  if (hasActiveFilters) {
    elements.filterInfoBar.style.display = 'flex';
    const parts = [];
    if (state.currentFilter !== 'all') parts.push(`Status: ${capitalize(state.currentFilter)}`);
    if (state.currentCategory !== 'all') parts.push(`Category: ${state.currentCategory}`);
    if (state.searchQuery && state.searchQuery.trim() !== '') parts.push(`Search: "${state.searchQuery.trim()}"`);
    elements.filterSummaryText.textContent = parts.join(' • ');
  } else {
    elements.filterInfoBar.style.display = 'none';
  }
}

function renderTasks() {
  const visibleTasks = getFilteredAndSortedTasks();
  elements.taskContainer.innerHTML = '';

  if (visibleTasks.length === 0) {
    // Show empty state
    elements.taskContainer.style.display = 'none';
    elements.emptyState.style.display = 'flex';

    if (state.tasks.length === 0) {
      elements.emptyTitle.textContent = 'No tasks created yet';
      elements.emptyDescription.textContent = 'Your task list is empty. Click "+ Add New Task" to create your first task.';
      elements.emptyResetFilterBtn.style.display = 'none';
    } else {
      elements.emptyTitle.textContent = 'No matching tasks';
      elements.emptyDescription.textContent = 'No tasks match your current filter and search criteria. Try adjusting your filters.';
      elements.emptyResetFilterBtn.style.display = 'inline-flex';
    }
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.taskContainer.style.display = state.viewMode === 'grid' ? 'grid' : 'flex';

  const fragment = document.createDocumentFragment();

  visibleTasks.forEach(task => {
    const card = document.createElement('article');
    card.className = `task-card ${task.completed ? 'is-completed' : ''}`;
    card.setAttribute('data-id', task.id);

    const dateStatus = getDateBadgeInfo(task.dueDate, task.completed);
    const categoryClass = getCategoryBadgeClass(task.category || 'Work');
    const priority = task.priority || 'Low';
    const priorityClass = `badge-priority-${priority.toLowerCase()}`;

    card.innerHTML = `
      <div class="task-checkbox-wrapper">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          id="cb-${task.id}" 
          ${task.completed ? 'checked' : ''} 
          aria-label="Mark task '${escapeHtml(task.title)}' as ${task.completed ? 'incomplete' : 'completed'}"
        >
      </div>

      <div class="task-content">
        <div class="task-header">
          <h4 class="task-title">${escapeHtml(task.title)}</h4>
          <div class="task-actions">
            <button class="btn-action action-edit" title="Edit task" aria-label="Edit task">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button class="btn-action action-delete" title="Delete task" aria-label="Delete task">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}

        <div class="task-meta">
          <!-- Priority Badge -->
          <span class="badge-tag ${priorityClass}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            ${priority} Priority
          </span>

          <!-- Category Badge -->
          <span class="badge-tag ${categoryClass}">
            ${escapeHtml(task.category || 'Work')}
          </span>

          <!-- Due Date Badge -->
          <span class="badge-date ${dateStatus.className}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${dateStatus.label}
          </span>
        </div>
      </div>
    `;

    // Event Listeners for Card Items
    const checkbox = card.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

    const editBtn = card.querySelector('.action-edit');
    editBtn.addEventListener('click', () => openEditTaskModal(task.id));

    const deleteBtn = card.querySelector('.action-delete');
    deleteBtn.addEventListener('click', () => openDeleteConfirmModal(task.id));

    fragment.appendChild(card);
  });

  elements.taskContainer.appendChild(fragment);
}

// --------------------------------------------------------------------------
// Helper UI Calculations
// --------------------------------------------------------------------------
function getDateBadgeInfo(dueDateStr, isCompleted) {
  if (!dueDateStr) return { label: 'No date', className: '' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dueDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return { label: dueDateStr, className: '' };
  }

  const [year, month, day] = parts;
  const dueDate = new Date(year, month - 1, day);
  dueDate.setHours(0, 0, 0, 0);

  if (isNaN(dueDate.getTime())) {
    return { label: dueDateStr, className: '' };
  }

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (isCompleted) {
    return { label: formattedDate, className: '' };
  }

  if (diffDays < 0) {
    return { label: `Overdue (${formattedDate})`, className: 'date-overdue' };
  } else if (diffDays === 0) {
    return { label: `Due Today`, className: 'date-today' };
  } else if (diffDays === 1) {
    return { label: `Due Tomorrow`, className: '' };
  } else {
    return { label: `Due ${formattedDate}`, className: '' };
  }
}

function getCategoryBadgeClass(category) {
  if (!category) return 'badge-cat-work';
  switch (category.toLowerCase()) {
    case 'work': return 'badge-cat-work';
    case 'personal': return 'badge-cat-personal';
    case 'development': return 'badge-cat-dev';
    case 'design': return 'badge-cat-design';
    default: return 'badge-cat-work';
  }
}

function setViewMode(mode) {
  state.viewMode = mode;
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);

  if (mode === 'grid') {
    elements.taskContainer.classList.remove('view-list');
    elements.taskContainer.classList.add('view-grid');
    elements.viewGridBtn.classList.add('active');
    elements.viewGridBtn.setAttribute('aria-pressed', 'true');
    elements.viewListBtn.classList.remove('active');
    elements.viewListBtn.setAttribute('aria-pressed', 'false');
  } else {
    elements.taskContainer.classList.remove('view-grid');
    elements.taskContainer.classList.add('view-list');
    elements.viewListBtn.classList.add('active');
    elements.viewListBtn.setAttribute('aria-pressed', 'true');
    elements.viewGridBtn.classList.remove('active');
    elements.viewGridBtn.setAttribute('aria-pressed', 'false');
  }
}

// ==========================================================================
// 6. Modal Dialogs Handling
// ==========================================================================
function openCreateTaskModal() {
  state.editingTaskId = null;
  elements.modalTitle.textContent = 'Create New Task';
  elements.taskForm.reset();
  elements.taskIdInput.value = '';
  
  // Set default due date to tomorrow
  elements.taskDueDateInput.value = getRelativeDate(1);
  
  // Reset priority radio to Low
  const lowRadio = elements.taskForm.querySelector('input[name="priority"][value="Low"]');
  if (lowRadio) lowRadio.checked = true;

  clearFormErrors();
  showModal(elements.taskModal);
  setTimeout(() => elements.taskTitleInput.focus(), 50);
}

function openEditTaskModal(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  state.editingTaskId = id;
  elements.modalTitle.textContent = 'Edit Task';
  elements.taskIdInput.value = task.id;
  elements.taskTitleInput.value = task.title;
  elements.taskDescInput.value = task.description || '';
  elements.taskCategorySelect.value = task.category || 'Work';
  elements.taskDueDateInput.value = task.dueDate || getRelativeDate(1);

  const priorityRadio = elements.taskForm.querySelector(`input[name="priority"][value="${task.priority}"]`);
  if (priorityRadio) priorityRadio.checked = true;

  clearFormErrors();
  showModal(elements.taskModal);
  setTimeout(() => elements.taskTitleInput.focus(), 50);
}

function openDeleteConfirmModal(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  state.taskToDeleteId = id;
  elements.deleteTaskTitle.textContent = `"${task.title}"`;
  showModal(elements.deleteModal);
}

function showModal(modalElement) {
  modalElement.classList.add('show');
  modalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalElement) {
  modalElement.classList.remove('show');
  modalElement.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function clearFormErrors() {
  elements.taskTitleInput.parentElement.classList.remove('has-error');
  elements.taskDueDateInput.parentElement.classList.remove('has-error');
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  const title = elements.taskTitleInput.value.trim();
  const description = elements.taskDescInput.value.trim();
  const category = elements.taskCategorySelect.value;
  const dueDate = elements.taskDueDateInput.value;
  const priorityRadio = elements.taskForm.querySelector('input[name="priority"]:checked');
  const priority = priorityRadio ? priorityRadio.value : 'Low';

  let hasError = false;

  if (!title) {
    elements.taskTitleInput.parentElement.classList.add('has-error');
    elements.titleError.textContent = 'Please provide a task title.';
    hasError = true;
  }

  if (!dueDate) {
    elements.taskDueDateInput.parentElement.classList.add('has-error');
    elements.dueDateError.textContent = 'Please choose a due date.';
    hasError = true;
  }

  if (hasError) return;

  const taskData = { title, description, category, dueDate, priority };

  if (state.editingTaskId) {
    updateTask(state.editingTaskId, taskData);
  } else {
    createTask(taskData);
  }

  closeModal(elements.taskModal);
}

// ==========================================================================
// 7. Toast Notification System
// ==========================================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'danger') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  // Auto remove after 3.2s
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3200);
}

// ==========================================================================
// 8. Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Mobile Drawer Toggle
  elements.mobileMenuBtn.addEventListener('click', () => {
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('open');
  });

  const closeSidebar = () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('open');
  };

  elements.sidebarCloseBtn.addEventListener('click', closeSidebar);
  elements.sidebarOverlay.addEventListener('click', closeSidebar);

  // Search Input Interactions
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    elements.clearSearchBtn.style.display = state.searchQuery ? 'flex' : 'none';
    updateUI();
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.searchQuery = '';
    elements.clearSearchBtn.style.display = 'none';
    elements.searchInput.focus();
    updateUI();
  });

  // Global Keyboard Shortcuts:
  // '/' to focus search (when not in an input/textarea/select/modal)
  // 'Escape' to close modals or drawer
  window.addEventListener('keydown', (e) => {
    const isTypingField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    const isTaskModalOpen = elements.taskModal.classList.contains('show');
    const isDeleteModalOpen = elements.deleteModal.classList.contains('show');

    if (e.key === '/' && !isTypingField && !isTaskModalOpen && !isDeleteModalOpen) {
      e.preventDefault();
      elements.searchInput.focus();
    } else if (e.key === 'Escape') {
      if (isTaskModalOpen) {
        closeModal(elements.taskModal);
      } else if (isDeleteModalOpen) {
        state.taskToDeleteId = null;
        closeModal(elements.deleteModal);
      } else if (elements.sidebar.classList.contains('open')) {
        closeSidebar();
      }
    }
  });

  // Live input error clearing
  elements.taskTitleInput.addEventListener('input', () => {
    if (elements.taskTitleInput.value.trim()) {
      elements.taskTitleInput.parentElement.classList.remove('has-error');
    }
  });

  elements.taskDueDateInput.addEventListener('change', () => {
    if (elements.taskDueDateInput.value) {
      elements.taskDueDateInput.parentElement.classList.remove('has-error');
    }
  });

  // Sidebar Filter Links
  elements.sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      state.currentFilter = link.getAttribute('data-filter');
      updateUI();
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });

  // Sidebar Category Links
  elements.categoryLinks.forEach(link => {
    link.addEventListener('click', () => {
      state.currentCategory = link.getAttribute('data-category');
      updateUI();
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });

  // Toolbar Tabs
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      state.currentFilter = tab.getAttribute('data-filter');
      updateUI();
    });
  });

  // Toolbar Category Dropdown
  elements.categoryFilter.addEventListener('change', (e) => {
    state.currentCategory = e.target.value;
    updateUI();
  });

  // Toolbar Sort Dropdown
  elements.sortBySelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    updateUI();
  });

  // View Mode Toggles
  elements.viewListBtn.addEventListener('click', () => setViewMode('list'));
  elements.viewGridBtn.addEventListener('click', () => setViewMode('grid'));

  // Reset Filters Bar & Button
  const resetFiltersAction = () => {
    state.currentFilter = 'all';
    state.currentCategory = 'all';
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    elements.categoryFilter.value = 'all';
    updateUI();
  };

  elements.clearAllFiltersBtn.addEventListener('click', resetFiltersAction);
  elements.emptyResetFilterBtn.addEventListener('click', resetFiltersAction);

  // New Task Openers
  elements.headerNewTaskBtn.addEventListener('click', openCreateTaskModal);
  elements.sidebarNewTaskBtn.addEventListener('click', () => {
    openCreateTaskModal();
    if (window.innerWidth <= 1024) closeSidebar();
  });
  elements.emptyNewTaskBtn.addEventListener('click', openCreateTaskModal);

  // Modal Close & Cancel
  elements.modalCloseBtn.addEventListener('click', () => closeModal(elements.taskModal));
  elements.modalCancelBtn.addEventListener('click', () => closeModal(elements.taskModal));
  elements.taskModal.addEventListener('click', (e) => {
    if (e.target === elements.taskModal) closeModal(elements.taskModal);
  });

  // Task Form Submit
  elements.taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Delete Modal Confirmation
  elements.cancelDeleteBtn.addEventListener('click', () => {
    state.taskToDeleteId = null;
    closeModal(elements.deleteModal);
  });
  elements.confirmDeleteBtn.addEventListener('click', () => {
    if (state.taskToDeleteId) {
      deleteTask(state.taskToDeleteId);
      state.taskToDeleteId = null;
    }
    closeModal(elements.deleteModal);
  });
  elements.deleteModal.addEventListener('click', (e) => {
    if (e.target === elements.deleteModal) {
      state.taskToDeleteId = null;
      closeModal(elements.deleteModal);
    }
  });

  // Reset Demo Data
  elements.resetDemoBtn.addEventListener('click', resetDemoData);
}

// ==========================================================================
// 9. Utility Functions
// ==========================================================================
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Launch the app when DOM content is ready
document.addEventListener('DOMContentLoaded', initApp);

