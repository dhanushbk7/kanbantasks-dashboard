import { motion } from 'framer-motion';
import { Task } from '../types';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Flame,
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
}

export default function DashboardView({ tasks }: DashboardViewProps) {
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
  );
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'done' && !isPast(new Date(t.dueDate)))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'high' && t.status !== 'done'
  );

  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
            </h2>
            <p className="text-gray-400 text-sm">
              You have {tasks.filter((t) => t.status !== 'done').length} tasks remaining. Keep up the great work!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">{completionRate}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 border border-red-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold text-white">Overdue Tasks</h3>
              <span className="ml-auto text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                {overdueTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-red-400">
                      {differenceInDays(new Date(), new Date(task.dueDate))} days overdue
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Upcoming</h3>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-400/10 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-amber-400/10 text-amber-400'
                      : 'bg-green-400/10 text-green-400'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming tasks</p>
            )}
          </div>
        </motion.div>

        {/* High Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-white">High Priority</h3>
            <span className="ml-auto text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
              {highPriorityTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {highPriorityTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg"
              >
                <p className="text-sm font-medium text-white">{task.title}</p>
                <span className="text-xs text-gray-400">{task.status}</span>
              </div>
            ))}
            {highPriorityTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">All caught up! 🎉</p>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-bold text-white">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-700/50 rounded-lg text-center">
              <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{doneTasks.length}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
            <div className="p-3 bg-gray-700/50 rounded-lg text-center">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">
                {tasks.filter((t) => t.status === 'in-progress').length}
              </p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
            <div className="p-3 bg-gray-700/50 rounded-lg text-center">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">
                {tasks.filter((t) => isToday(new Date(t.dueDate))).length}
              </p>
              <p className="text-xs text-gray-400">Due Today</p>
            </div>
            <div className="p-3 bg-gray-700/50 rounded-lg text-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{overdueTasks.length}</p>
              <p className="text-xs text-gray-400">Overdue</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
