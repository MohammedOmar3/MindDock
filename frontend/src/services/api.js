// Minimal API service - fetch wrapper with error handling
const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    try {
      error.data = await response.json();
      console.error('API Error Response:', error.data);
    } catch {
      error.data = null;
    }
    throw error;
  }
  return response.json();
}

export const api = {
  // Tasks
  getTasks: () => fetch(`${API_BASE}/tasks`).then(handleResponse),
  getTask: (id) => fetch(`${API_BASE}/tasks/${id}`).then(handleResponse),
  createTask: (data) => fetch(`${API_BASE}/tasks`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateTask: (id, data) => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }),

  // Daily Logs
  getDailyLogs: () => fetch(`${API_BASE}/dailylogs`).then(handleResponse),
  getDailyLog: (date) => fetch(`${API_BASE}/dailylogs/${date}`).then(handleResponse),
  createDailyLog: (data) => fetch(`${API_BASE}/dailylogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateDailyLog: (id, data) => fetch(`${API_BASE}/dailylogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Notes
  getNotes: () => fetch(`${API_BASE}/notes`).then(handleResponse),
  getNote: (id) => fetch(`${API_BASE}/notes/${id}`).then(handleResponse),
  createNote: (data) => fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateNote: (id, data) => fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteNote: (id) => fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' }),

  // Whiteboard Folders
  getWhiteboardFolders: () => fetch(`${API_BASE}/whiteboardfolders`).then(handleResponse),
  getWhiteboardFolder: (id) => fetch(`${API_BASE}/whiteboardfolders/${id}`).then(handleResponse),
  createWhiteboardFolder: (data) => fetch(`${API_BASE}/whiteboardfolders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateWhiteboardFolder: (id, data) => fetch(`${API_BASE}/whiteboardfolders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteWhiteboardFolder: (id) => fetch(`${API_BASE}/whiteboardfolders/${id}`, { method: 'DELETE' }),

  // Whiteboards
  getWhiteboards: () => fetch(`${API_BASE}/whiteboards`).then(handleResponse),
  getWhiteboard: (id) => fetch(`${API_BASE}/whiteboards/${id}`).then(handleResponse),
  createWhiteboard: (data) => fetch(`${API_BASE}/whiteboards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateWhiteboard: (id, data) => fetch(`${API_BASE}/whiteboards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteWhiteboard: (id) => fetch(`${API_BASE}/whiteboards/${id}`, { method: 'DELETE' }),

  // Quick Capture
  capture: (text) => fetch(`${API_BASE}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }).then(handleResponse),
};
