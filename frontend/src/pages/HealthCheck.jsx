import { useState, useEffect } from 'react';

export default function HealthCheck() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Check API connectivity
    fetch('/api/tasks', { method: 'GET' })
      .then(r => {
        if (r.status === 404) {
          setApiStatus('backend-running');
          return;
        }
        if (r.ok) {
          setApiStatus('connected');
          return r.json();
        }
        throw new Error(`HTTP ${r.status}`);
      })
      .catch(err => {
        console.error('API Check failed:', err);
        setApiStatus('failed');
        setApiError(err.message);
      });
  }, []);

  const statusColor = {
    checking: 'bg-yellow-100 text-yellow-800',
    connected: 'bg-green-100 text-green-800',
    'backend-running': 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800'
  };

  const statusMessage = {
    checking: '🔄 Checking API connection...',
    connected: '✅ Connected to backend',
    'backend-running': '✅ Backend running (API responding)',
    failed: '❌ Cannot connect to backend'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Personal Work OS</h1>

        <div className={`p-6 rounded-lg ${statusColor[apiStatus] || 'bg-gray-100'}`}>
          <p className="text-lg font-medium">{statusMessage[apiStatus]}</p>
        </div>

        {apiStatus === 'failed' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900 font-semibold mb-2">Troubleshooting:</p>
            <ol className="text-red-800 text-sm space-y-2 list-decimal list-inside">
              <li>Make sure backend is running</li>
              <li>Run: <code className="bg-red-100 px-2 py-1 rounded">dotnet run --project Api.csproj</code></li>
              <li>Backend should listen on port 5000</li>
              <li>Refresh this page when backend is ready</li>
            </ol>
            <p className="text-red-700 text-xs mt-3">Error: {apiError}</p>
          </div>
        )}

        {apiStatus === 'connected' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-900">✅ Application is ready!</p>
            <p className="text-green-800 text-sm mt-2">All systems connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
