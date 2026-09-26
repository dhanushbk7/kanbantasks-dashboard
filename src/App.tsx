import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Task } from './types';
import { columns, initialTasks } from './data';
import Sidebar from './components/Sidebar';
import KanbanColumn from './components/KanbanColumn';
import SortableTaskCard from './components/SortableTaskCard';
import StatsPanel from './components/StatsPanel';
import DashboardView from './components/DashboardView';
import AddTaskModal from './components/AddTaskModal';
import { Plus, Search, Bell, Menu, X } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeView, setActiveView] = useState('board');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<Task['status']>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // If moving to done, fire confetti!
    if (newStatus === 'done') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#8b5cf6'],
    });
  }, []);

  const openAddModal = (status: Task['status']) => {
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  const viewTitles: Record<string, string> = {
    board: 'Kanban Board',
    analytics: 'Analytics',
    dashboard: 'Dashboard',
    settings: 'Settings',
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-0 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar activeView={activeView} onViewChange={(v) => { setActiveView(v); setSidebarOpen(false); }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{viewTitles[activeView]}</h1>
              <p className="text-xs text-gray-400">
                {tasks.length} total tasks · {tasks.filter((t) => t.status === 'done').length} completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-40"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <Bell className="w-4 h-4" />
              {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length}
                </span>
              )}
            </button>

            {/* Add Task */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAddModal('todo')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeView === 'board' && (
              <motion.div
                key="board"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                    {columns.map((column) => {
                      const columnTasks = filteredTasks.filter(
                        (t) => t.status === column.id
                      );
                      return (
                        <KanbanColumn
                          key={column.id}
                          column={column}
                          tasks={columnTasks}
                          onAddTask={openAddModal}
                        />
                      );
                    })}
                  </div>
                  <DragOverlay>
                    {activeTask && (
                      <div className="rotate-3 opacity-90">
                        <SortableTaskCard task={activeTask} index={0} />
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>
              </motion.div>
            )}

            {activeView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <StatsPanel tasks={tasks} />
              </motion.div>
            )}

            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <DashboardView tasks={tasks} />
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl"
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Dark Mode</p>
                        <p className="text-xs text-gray-400">Currently using dark theme</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Notifications</p>
                        <p className="text-xs text-gray-400">Get notified about task updates</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Confetti Effects</p>
                        <p className="text-xs text-gray-400">Show confetti when completing tasks</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Auto-save</p>
                        <p className="text-xs text-gray-400">Automatically save changes</p>
                      </div>
                      <div className="w-12 h-6 bg-gray-600 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
        defaultStatus={modalDefaultStatus}
      />
    </div>
  );
}
