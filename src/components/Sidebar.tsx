import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'board', label: 'Board', icon: KanbanSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
          <p className="text-xs text-gray-400">Productivity Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-indigo-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20">
        <p className="text-sm text-indigo-300 font-medium">Pro Tip</p>
        <p className="text-xs text-gray-400 mt-1">
          Drag tasks between columns to update their status instantly.
        </p>
      </div>
    </aside>
  );
}
