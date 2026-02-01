import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import LogsList from './pages/LogsList';
import NoteList from './pages/NoteList';
import DailyLogEditor from './pages/DailyLogEditor';
import WhiteboardList from './pages/WhiteboardList';
import WhiteboardEditor from './pages/WhiteboardEditor';
import HealthCheck from './pages/HealthCheck';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [params, setParams] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Test API connection on load
    fetch('/api/tasks')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .catch(err => {
        console.error('API connection test failed:', err);
        setApiError('Cannot connect to backend. Make sure it\'s running on port 5000.');
      });
  }, []);

  const handleRoute = (page, pageParams = {}) => {
    // Clear URL hash to remove Excalidraw parameters
    window.location.hash = '';
    
    // Support string navigation like "logs/2026-02-01"
    if (typeof page === 'string' && page.includes('/')) {
      const [pageName, ...rest] = page.split('/');
      setCurrentPage(pageName);
      if (rest.length === 1) {
        setParams({ date: rest[0] });
      }
    } else {
      setCurrentPage(page);
      setParams(pageParams);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Sidebar Navigation */}
      <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 fixed h-screen shadow-sm">
        <button
          onClick={() => handleRoute('dashboard')}
          title="Dashboard"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
            currentPage === 'dashboard' 
              ? 'bg-slate-100 text-slate-900 shadow-md' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m0 5h.01" />
          </svg>
        </button>
        <button
          onClick={() => handleRoute('tasks')}
          title="Tasks"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
            currentPage === 'tasks' 
              ? 'bg-slate-100 text-slate-900 shadow-md' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={() => handleRoute('logs-list')}
          title="Logs"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
            currentPage === 'logs-list' || currentPage === 'logs'
              ? 'bg-slate-100 text-slate-900 shadow-md' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </button>
        <button
          onClick={() => handleRoute('notes')}
          title="Notes"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
            currentPage === 'notes' 
              ? 'bg-slate-100 text-slate-900 shadow-md' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button
          onClick={() => handleRoute('whiteboards')}
          title="Whiteboards"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
            currentPage === 'whiteboards' 
              ? 'bg-slate-100 text-slate-900 shadow-md' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 flex flex-col">
        {/* Page Content */}
        <main className="flex-1">
          {apiError && !currentPage.includes('health') ? (
            <HealthCheck />
          ) : (
            <>
              {currentPage === 'dashboard' && <Dashboard onNavigate={handleRoute} />}
              {currentPage === 'tasks' && <TaskList />}
              {currentPage === 'logs-list' && (
                <LogsList onSelectLog={(date) => handleRoute('logs', { date })} />
              )}
              {currentPage === 'logs' && <DailyLogEditor date={params.date || new Date().toISOString().split('T')[0]} onSaved={() => handleRoute('dashboard')} />}
              {currentPage === 'notes' && <NoteList />}
              {currentPage === 'whiteboards' && (
                <WhiteboardList onSelectWhiteboard={(id) => handleRoute('whiteboard-editor', { id })} />
              )}
              {currentPage === 'whiteboard-editor' && <WhiteboardEditor id={params.id} onBack={() => handleRoute('whiteboards')} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
