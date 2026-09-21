import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskModal from '../common/TaskModal';
import DeleteModal from '../common/DeleteModal';
import ToastContainer from '../common/ToastContainer';
import { useTasks } from '../../context/TaskContext';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    let success = false;
    if (editingTask) {
      success = await updateTask(editingTask.id, taskData);
    } else {
      success = await createTask(taskData);
    }
    setIsSubmitting(false);
    if (success) {
      handleCloseTaskModal();
    }
  };

  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    const success = await deleteTask(taskId);
    setIsDeleting(false);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="app-shell">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="app-main-layout">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCreateModal={handleOpenCreateModal}
        />

        <main className="app-content">
          <Outlet 
            context={{
              onOpenCreateModal: handleOpenCreateModal,
              onOpenEditModal: handleOpenEditModal,
              onOpenDeleteModal: handleOpenDeleteModal,
              onToggleComplete: toggleTaskCompletion
            }}
          />
        </main>
      </div>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        isSubmitting={isSubmitting}
      />

      {/* Task Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
