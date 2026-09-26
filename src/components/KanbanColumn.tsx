import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Task, Column } from '../types';
import SortableTaskCard from './SortableTaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (status: Task['status']) => void;
}

export default function KanbanColumn({ column, tasks, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] rounded-2xl p-4 transition-all ${
        isOver ? 'bg-gray-800/80 ring-2 ring-indigo-500/50' : 'bg-gray-800/40'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {column.title}
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddTask(column.id)}
          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.map((task, index) => (
            <SortableTaskCard key={task.id} task={task} index={index} />
          ))}
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-32 border-2 border-dashed border-gray-700 rounded-xl"
            >
              <p className="text-sm text-gray-500">Drop tasks here</p>
            </motion.div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
