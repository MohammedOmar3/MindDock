# MindDock

A minimal, single-user web application for task tracking, work logging, note-taking, and collaborative sketching. Designed for personal productivity and self-reflection.
<img width="1916" height="943" alt="image" src="https://github.com/user-attachments/assets/8bf12b86-1159-440f-9b69-e479233c1290" />


## Features

- **Task Management** - Create, edit, and track tasks with due dates and status tracking (Todo/Doing/Done)
- **Daily Logs** - Structured reflection on work completed, blockers encountered, learnings, and tomorrow's priorities
- **Notes** - Create and organize notes with markdown support
- **Whiteboard** - Draw and sketch ideas with integrated Excalidraw for visual planning
- **Quick Capture** - Instantly add tasks or notes using simple text prefixes
- **Dashboard** - Real-time view of today's tasks, activity heatmap, and key metrics
- **Local Storage** - All data persists in SQLite with zero cloud dependencies

## Getting Started

### Prerequisites

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 18+** - [Download](https://nodejs.org/)

### Installation

#### Backend

```bash
cd minddock
dotnet build MindDock.sln
dotnet run
```

The API will be available at `http://localhost:5000`

#### Frontend

In a new terminal:

```bash
cd minddock/frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Dashboard

The dashboard provides:
- Today's active tasks and pending items
- Calendar visualization showing logged days (green = logged, red = missed)
- Quick statistics (tasks today, total notes, weekly logs)
- Inline input for capturing new items

### Quick Capture

Use the quick capture input on the dashboard with these prefixes:

- `todo something` - Creates a task titled "something"
- `note something` - Creates a note titled "something"
- Any other text - Creates a note by default

### Navigation

Left sidebar navigation provides access to:
- Dashboard (home)
- Tasks
- Logs
- Notes
- Whiteboards

## Architecture

### Backend (.NET 9)

```
Controllers/          - REST API endpoints
  ├── TasksController.cs
  ├── DailyLogsController.cs
  ├── NotesController.cs
  ├── WhiteboardsController.cs
  ├── WhiteboardFoldersController.cs
  └── CaptureController.cs
Models/              - Entity models
  ├── TaskItem.cs
  ├── DailyLog.cs
  ├── Note.cs
  ├── WhiteboardDocument.cs
  └── WhiteboardFolder.cs
Data/                - Entity Framework context
  └── AppDbContext.cs
```

### Frontend (React + Vite)

```
src/
  ├── pages/         - Route components
  │   ├── Dashboard.jsx
  │   ├── TaskList.jsx
  │   ├── DailyLogEditor.jsx
  │   ├── NoteList.jsx
  │   ├── WhiteboardList.jsx
  │   └── WhiteboardEditor.jsx
  ├── components/    - Reusable UI components
  │   ├── Calendar.jsx
  │   ├── DailySummary.jsx
  │   └── QuickStats.jsx
  ├── services/      - HTTP client
  │   └── api.js
  └── App.jsx        - Main application router
```

## API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Daily Logs
- `GET /api/dailylogs` - List all logs
- `GET /api/dailylogs/{date}` - Get log for specific date
- `POST /api/dailylogs` - Create log
- `PUT /api/dailylogs/{id}` - Update log

### Notes
- `GET /api/notes` - List all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

### Whiteboards
- `GET /api/whiteboards` - List all whiteboards
- `POST /api/whiteboards` - Create whiteboard
- `PUT /api/whiteboards/{id}` - Update whiteboard
- `DELETE /api/whiteboards/{id}` - Delete whiteboard
- `GET /api/whiteboards/folder/{folderId}` - List whiteboards in folder

### Whiteboard Folders
- `GET /api/folders` - List all folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder

### Quick Capture
- `POST /api/capture` - Body: `{"text": "..."}`

## Database

The application uses SQLite for data persistence. The database file (`minddock.db`) is created automatically on first run in the project root.

**Important**: To preserve your data:
1. Back up `minddock.db` regularly
2. Do not delete this file without a backup
3. The database is excluded from version control

## Technology Stack

- **Backend**: .NET 9, Entity Framework Core, SQLite
- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Sketching**: Excalidraw
- **Markdown**: React Markdown

## Contributing

Contributions are welcome. Please:
- Open an issue for bugs or features
- Keep changes focused and minimal
- Follow existing code patterns

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Troubleshooting

**API will not start**

Verify that port 5000 is not in use:

```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

**Frontend will not start**

Clear dependencies and reinstall:

```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

**Database corruption**

Reset the database:

```bash
# Delete the database file (WARNING: loses all data)
rm minddock.db minddock.db-*

# Database will be recreated on next run
dotnet run
```
