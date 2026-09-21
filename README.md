# 🚀 TaskFlow – Modern Task Management Single-Page Application (SPA)
**YR NOVATECH Internship • Task 5: Advanced Frontend & API Integration**  
**Student:** Ansh Jaiswal  
**Repository:** [github.com/anshjaiswal2911-tech/taskflow-dashboard](https://github.com/anshjaiswal2911-tech/taskflow-dashboard)  
**Task 3 REST API:** `https://task-manager-api-dplt.onrender.com/api`

---

## 🌟 Project Overview

**TaskFlow Dashboard v2.0** is an enterprise-grade, modern Single-Page Application (SPA) built with **React 18**, **Vite 6**, and **React Router v6**, integrated seamlessly with the **Task 3 REST API** deployed on Render.

The application delivers a responsive, accessible task management experience featuring full asynchronous CRUD workflows, client-side routing, centralized React Context state management, API resiliency with offline fallback caching, form validation, theme customization (Light/Dark mode), and live velocity analytics.

---

## 🏗️ Architecture & Technical Design

```text
taskflow-dashboard/
├── index.html                    # Root HTML5 template
├── vite.config.js                # Vite bundler configuration
├── package.json                  # Dependencies and scripts (React 18, React Router v6)
├── src/
│   ├── main.jsx                  # Application entry point
│   ├── App.jsx                   # Root layout, routing configuration, provider tree
│   ├── api/
│   │   ├── apiClient.js          # Fetch wrapper, error parsing, configurable base URL
│   │   └── taskService.js        # Service layer (GET, POST, PUT, DELETE, checkHealth)
│   ├── context/
│   │   ├── TaskContext.jsx       # Global tasks state, active filters, search, CRUD hooks
│   │   ├── ThemeContext.jsx      # Light/Dark mode state management & localStorage persistence
│   │   └── ToastContext.jsx      # Non-blocking notification dispatch queue
│   ├── components/
│   │   ├── common/
│   │   │   ├── ApiStatusBadge.jsx   # Live backend connectivity & latency badge
│   │   │   ├── DeleteModal.jsx      # Two-step destructive action confirmation
│   │   │   ├── EmptyState.jsx       # Contextual empty state illustrations
│   │   │   ├── ErrorBoundary.jsx    # React Error Boundary for runtime resilience
│   │   │   ├── LoadingSkeleton.jsx  # Pulse skeleton loaders during API fetch
│   │   │   ├── TaskModal.jsx        # Create & Edit task dialog with form validation
│   │   │   └── ToastContainer.jsx   # Global floating toast notifications
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx        # Base layout shell (Sidebar + Header + Outlet)
│   │   │   ├── Header.jsx           # Global search with shortcut, theme switch, API badge
│   │   │   └── Sidebar.jsx          # Collapsible navigation, category links, sprint goal
│   │   └── tasks/
│   │       ├── TaskCard.jsx         # Individual task card with status, category & actions
│   │       ├── TaskStats.jsx        # 4 KPI metric cards (Total, In Progress, Completed, High)
│   │       └── TaskToolbar.jsx      # Status tabs, category/priority filters, sort & view toggle
│   ├── pages/
│   │   ├── DashboardPage.jsx     # Overview, KPI statistics, active priorities & sprint progress
│   │   ├── TasksPage.jsx         # Comprehensive task management, list/grid view, live search
│   │   ├── AnalyticsPage.jsx     # Velocity metrics, category bars, priority distribution
│   │   ├── SettingsPage.jsx      # API endpoint configuration, live health test, cache reset
│   │   └── NotFoundPage.jsx      # Accessible 404 error page
│   └── styles/
│       ├── index.css             # CSS design tokens, CSS variables, typography, theme styles
│       └── components.css        # Layout, cards, modals, toolbar, skeletons, animations
```

---

## 🚦 Client-Side Routing (React Router v6)

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | `DashboardPage` | Executive overview, 4 KPI cards, active priority deliverables, sprint progress |
| `/tasks` | `TasksPage` | Full task management grid/list, real-time search, category/priority filtering |
| `/analytics` | `AnalyticsPage` | Visual distribution by category, priority breakdown, completion velocity |
| `/settings` | `SettingsPage` | API Base URL configuration, live health check probe, theme switch, cache purge |
| `*` | `NotFoundPage` | 404 fallback page with navigation redirect |

---

## 🔌 Task 3 REST API Integration

The application integrates with the Task 3 REST API:
- **Default Production Base URL:** `https://task-manager-api-dplt.onrender.com/api`
- **Configurable Base URL:** Users can test custom local/staging endpoints via the Settings page (`/settings`).

### REST API Endpoints

| HTTP Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Retrieve all tasks | — |
| `GET` | `/tasks/:id` | Retrieve single task by ID | — |
| `POST` | `/tasks` | Create a new task | `{ title, description, status, priority, category, due_date }` |
| `PUT` | `/tasks/:id` | Update existing task | `{ title, description, status, priority, category, due_date }` |
| `DELETE` | `/tasks/:id` | Permanently delete a task | — |

### Service Layer Architecture (`src/api/`)
1. **`apiClient.js`:** Centralized `request()` helper with automatic JSON header injection, a 15-second request timeout controller, network error trapping, and uniform error serialization.
2. **`taskService.js`:** Clean abstraction layer providing CRUD methods (`getTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`, `checkHealth`), ensuring components remain decoupled from HTTP implementation details.
3. **Data Normalization:** Translates backend snake_case properties (`due_date`, `created_at`) into UI-friendly camelCase, with fallback handling for unassigned dates or categories.

---

## ⚡ State Management & Resilience

- **React Context API:**
  - `TaskContext`: Holds master task records, filtered task computation, active filter states (`status`, `category`, `priority`, `sort`), global search query, API status (`online`, `connecting`, `offline`), and async CRUD actions.
  - `ThemeContext`: Toggles Light and Dark themes, with system color scheme detection and `localStorage` persistence.
  - `ToastContext`: Dispatches non-blocking alerts (`success`, `danger`, `warning`, `info`) with auto-dismissal.
- **Offline Resilient Caching:** Caches API payloads in `localStorage` so the application renders cached data immediately on cold starts while synchronizing with the cloud backend in the background.
- **Render Cold-Start Handling:** Visual indicators (`ApiStatusBadge`) notify users when the cloud server is waking from sleep, with automatic retry mechanisms.
- **React Error Boundary:** Class-based error boundary (`ErrorBoundary.jsx`) wraps the application tree to catch unexpected rendering exceptions and present a clean recovery UI.

---

## 🎨 UI & UX Highlights

- **Design Tokens & Dark Mode:** Built with clean CSS Custom Properties, featuring smooth transitions and high-contrast color palettes.
- **View Toggle:** Switch effortlessly between **List View** and **Grid View**.
- **Keyboard Navigation:** Press `/` anywhere in the dashboard to immediately focus the global search bar; press `Esc` to close open modals or blur search.
- **Loading & Skeleton States:** Pulse loading skeletons ensure zero layout shifts during async API round trips.
- **Mobile Responsive:** Full support for mobile drawers, responsive grids, and touch targets across screen sizes (<640px, 768px, 1024px, 1280px+).

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm (v9.0 or higher)

### Installation & Development
```bash
# 1. Clone repository
git clone https://github.com/anshjaiswal2911-tech/taskflow-dashboard.git
cd taskflow-dashboard

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Submission Verification

- ✅ React 18 + Vite 6 Single Page Application
- ✅ Client-Side Routing with React Router v6 (`/`, `/tasks`, `/analytics`, `/settings`, `*`)
- ✅ Task 3 REST API Integration (`GET`, `POST`, `PUT`, `DELETE` on `/tasks`)
- ✅ Centralized API Service Layer (`src/api/taskService.js`)
- ✅ React Context State Management (`TaskContext`, `ThemeContext`, `ToastContext`)
- ✅ Form Handling & Validation on Task Creation/Editing
- ✅ React Error Boundary (`ErrorBoundary.jsx`)
- ✅ Responsive Design across Desktop, Tablet, and Mobile
- ✅ Clean Production Build (`dist/` generated with 0 errors)

---

## 📄 License
Open source under the [MIT License](LICENSE). Built for the YR NOVATECH Internship Program.
