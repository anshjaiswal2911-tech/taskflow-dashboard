# 🚀 TaskFlow – Task Management Dashboard

TaskFlow is a modern, high-performance, and responsive task management dashboard crafted with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. Built without external UI frameworks or heavy dependencies, it demonstrates clean architectural design, state persistence, accessible interface patterns, and fluid micro-interactions.

---

## 🌟 Key Features

### 1. Modern SaaS Dashboard Layout
- **Collapsible Sidebar Navigation:** Quick filtering by status (All, In Progress, Completed, High Priority) and categories (Work, Personal, Development, Design) with live item count badges.
- **Top Header Bar:** Global real-time search with keyboard shortcut (`/`), active date display, responsive mobile menu drawer, and light/dark theme toggle.
- **View Switcher:** Seamlessly toggle between **List View** and **Grid View** layout preferences.

### 2. Full Task Management (CRUD)
- **Add New Task:** Modal dialog with form validation for task title, description, priority (Low, Medium, High), category, and due date.
- **Edit Task:** Update existing task details in-place with pre-populated form state.
- **Mark Complete:** Instant checkbox toggle with smooth animations, strikethrough styling, and dynamic status transitions.
- **Delete Confirmation:** Safe two-step deletion confirmation modal to prevent accidental data loss.

### 3. Dynamic Real-Time Statistics
- **Total Tasks:** Complete count of recorded tasks.
- **Pending Tasks:** Active items requiring attention.
- **Completed Tasks:** Real-time completion count and percentage progress.
- **High Priority Tasks:** Urgent items flagged for quick visibility.
- **Productivity Goal Bar:** Dynamic progress bar in the sidebar reflecting live progress.

### 4. Advanced Filtering & Sorting
- **Status Filter:** View All, Active, Completed, or High Priority items.
- **Category Filter:** Filter tasks by category tags (*Work*, *Personal*, *Development*, *Design*).
- **Sort Options:** Sort by Due Date (Earliest / Latest), Priority (High to Low), Recently Created, or Alphabetical (A-Z).
- **Active Filter Summary Bar:** Visual feedback of active filters with a one-click reset action.

### 5. Instant Real-Time Search
- Instant live searching across task titles, descriptions, and categories.
- Accessible keyboard shortcut (`/` to focus search, `Esc` to clear/unfocus).

### 6. Light / Dark Theme Support
- Clean, contrast-accessible Dark Mode with system preference detection (`prefers-color-scheme`).
- Theme preference saved to `localStorage` for continuity across sessions.

### 7. LocalStorage Persistence
- All tasks, theme preferences, and layout view modes are saved in `localStorage`.
- Includes sensible initial demo tasks on first load and a **"Reset Demo Data"** utility button.

### 8. Micro-Interactions & Accessible Feedback
- Non-blocking toast notification system for user actions (create, edit, delete, complete).
- Accessible keyboard navigation (`Esc` closes modals, `Enter` submits forms, `Tab` focus ring management).
- Empty state screens with contextual actions when no tasks match filters.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic markup (`<aside>`, `<main>`, `<header>`, `<article>`, `<nav>`, ARIA roles & attributes).
- **CSS3:** Custom Properties (CSS Variables) for theming, Flexbox & Grid layouts, Backdrop Blur, transitions, animations, and media queries.
- **JavaScript (ES6+):** Pure Vanilla JS with modular architecture, DOM event delegation, local state management, and `localStorage` API.
- **Fonts & Assets:** Google Fonts (*Plus Jakarta Sans*), lightweight inline SVGs.

---

## 📁 Project Structure

```text
taskflow-dashboard/
├── index.html       # Semantic HTML5 layout and modal dialogs
├── style.css        # CSS3 variables, layout, animations & dark theme
├── script.js        # Vanilla JS state, CRUD, filters, statistics & storage
├── .gitignore       # Git ignore rules for clean repository
└── README.md        # Project documentation and architecture guide
```

---

## ⚡ How to Run Locally

Since this project has **zero build dependencies**, you can run it directly in any modern web browser.

### Option 1: Direct File Open
1. Clone or download this repository.
2. Double-click `index.html` (or right-click and choose **Open with Google Chrome / Firefox / Safari / Edge**).

### Option 2: Local Development Server (Optional)
If you have Python installed:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

Using Node.js (`npx`):
```bash
npx serve .
```

---

## 🧠 Core Frontend Concepts Demonstrated

1. **State-Driven UI Architecture:** Single source of truth in JavaScript (`state` object) that declaratively synchronizes the DOM, badges, and KPI cards on every state mutation.
2. **Accessible Modals & Overlays:** Proper ARIA attributes (`aria-hidden`, `aria-modal`, `role="dialog"`), body scroll locking, and backdrop click handling.
3. **CSS Custom Properties (Variables):** Scalable design system with centralized color tokens, dynamic theme switching, and smooth transitions.
4. **Responsive Layout Architecture:** Mobile-first and desktop breakpoints using CSS Grid and Flexbox, with an off-canvas drawer navigation for mobile and tablet screens.
5. **Form Validation & Error Handling:** Inline form feedback and constraint validation before updating state.
6. **Toast Notification Pattern:** Reusable, auto-dismissing floating alert banner system with customizable types (`success`, `danger`, `info`).
7. **Cross-Session Persistence:** Serialization and deserialization of application state with `localStorage`.

---

## 🔮 Future Improvements

- [ ] **Drag & Drop Reordering:** HTML5 Drag and Drop API or Kanban Board view.
- [ ] **Data Export & Import:** Export task lists to JSON or CSV and restore backups.
- [ ] **Browser Notifications:** Web Notification API reminders for overdue tasks.
- [ ] **Subtasks / Checklists:** Nested subtasks inside each main task item.
- [ ] **Tags & Labels Customizer:** Allow users to create custom categories with tailored colors.

---

## 📄 License
This project was built for educational and internship portfolio demonstration purposes. Open source under the [MIT License](LICENSE).
