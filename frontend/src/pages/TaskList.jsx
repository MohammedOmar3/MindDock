import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const task = await api.createTask({
        title: newTitle
      });
      setTasks([...tasks, task]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (task) => {
    try {
      const updated = await api.updateTask(task.id, {
        status: 'Done'
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const activeTasks = tasks.filter(t => t.status !== 'Done');
  const completedTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-light text-slate-900 mb-8">Tasks</h1>

      <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
          <button type="submit" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm">
            Add
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Tasks</h2>
        {activeTasks.length === 0 ? (
          <p className="text-slate-500">No active tasks</p>
        ) : (
          <div className="space-y-3">
            {activeTasks.map(task => (
              <div key={task.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-sm text-slate-500">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleComplete(task)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Completed</h2>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <div key={task.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-600">
                <p className="font-medium line-through text-slate-600">{task.title}</p>
                <p className="text-sm text-slate-500">Completed: {new Date(task.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
