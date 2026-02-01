import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function QuickStats() {
  const [stats, setStats] = useState({
    tasksToday: 0,
    tasksDoing: 0,
    tasksCompleted: 0,
    totalNotes: 0,
    logsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const tasks = await api.getTasks();
      const notes = await api.getNotes();
      const logs = await api.getDailyLogs();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Count tasks created today
      const todayTasks = tasks.filter(t => {
        if (t.createdAt) {
          const createdDate = new Date(t.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        }
        return false;
      });

      // Count logs this week
      const recentLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekAgo;
      });

      setStats({
        tasksToday: todayTasks.length,
        tasksDoing: tasks.filter(t => t.status === 'Doing').length,
        tasksCompleted: tasks.filter(t => t.status === 'Done').length,
        totalNotes: notes.length,
        logsThisWeek: recentLogs.length
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-3xl font-light text-slate-700">{stats.tasksToday}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">Today's Tasks</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-3xl font-light text-slate-700">{stats.tasksDoing}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">In Progress</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-3xl font-light text-slate-700">{stats.tasksCompleted}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">Completed</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-3xl font-light text-slate-700">{stats.totalNotes}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">Total Notes</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-3xl font-light text-slate-700">{stats.logsThisWeek}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">Logs This Week</div>
      </div>
    </div>
  );
}
