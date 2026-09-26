import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '../types';
import {
  Calendar,
  Tag,
  GripVertical,
  AlertCircle,
  AlertTriangle,
  Minus,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface SortableTaskCardProps {
  task: Task;
  index: number;
}

const priorityConfig = {
  high: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'High' },
  medium: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Medium' },
  low: { icon: Minus, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Low' },
};

export default function SortableTaskCard({ task, index }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== 'done';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-gray-600 hover:shadow-lg hover:shadow-black/20 transition-all group ${
        isDragging ? 'opacity-50 shadow-2xl shadow-indigo-500/20 border-indigo-500/50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
              <PriorityIcon className="w-3 h-3" />
              {priority.label}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-white mb-1 truncate">
            {task.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span className={isOverdue ? 'text-red-400 font-medium' : ''}>
                {isOverdue ? 'Overdue: ' : ''}
                {format(dueDate, 'MMM d')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-gray-300"
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
