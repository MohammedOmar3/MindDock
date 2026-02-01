# Copilot Instructions: Personal Work OS

## Project Overview
Single-user web app for daily task tracking, work logging, note-taking, and sketching. V1 is minimal and shippable—no auth, no collaboration, no analytics.

**Tech Stack**: .NET 9 API + Entity Framework Core + SQLite (backend) | React + Vite (frontend) | Tailwind CSS | Excalidraw for whiteboarding

## Architecture & Data Model

**Four Core Entities** (see `requirements.md` for full schema):
- **Task**: `Id`, `Title`, `DueDate` (nullable), `Status` (Todo/Doing/Done), timestamps
- **DailyLog**: `Id`, `Date` (unique), `WorkedOn`/`Blockers`/`Learned`/`TomorrowFocus`, timestamps  
- **Note**: `Id`, `Title`, `Content` (markdown), timestamps
- **WhiteboardDocument**: `Id`, `Title`, `ExcalidrawJson` (JSON blob), timestamps

**Key Constraint**: One log per calendar day (unique index on `Date` in DailyLog).

## API & Routing

**REST endpoints** (`/api/{resource}`):
- Tasks: `GET`, `POST /api/tasks`, `PUT /api/tasks/{id}`
- Daily Logs: `GET /api/dailylogs`, `GET/POST /api/dailylogs/{date}`, `PUT /api/dailylogs/{id}`
- Notes: Full CRUD at `/api/notes` and `/api/notes/{id}`
- Whiteboards: Full CRUD at `/api/whiteboards` and `/api/whiteboards/{id}`
- **Quick Capture**: `POST /api/capture` (body: `{ "text": "..." }`) — backend parses prefix (`todo`, `note`) and creates appropriate entity

**Frontend Routes**:
- `/` Dashboard (today's tasks + quick capture input)
- `/tasks`, `/logs`, `/logs/{date}`, `/notes`, `/notes/{id}`, `/whiteboard`, `/whiteboard/{id}`

## Critical Workflows & Conventions

### Quick Capture Pattern
Global input detected in header/navbar. Rules:
- Prefix `todo something` → creates Task with title "something"
- Prefix `note something` → creates Note (title = first 40 chars, content = full text)
- Anything else → creates Note by default

### Dashboard Logic (Home Page)
- Show today's date
- Display tasks where `(DueDate == Today AND Status != Done) OR Status == Doing`
- "Open Today's Log" button: fetch/create log for today and navigate to edit page

### Daily Log Uniqueness
When creating/updating logs, enforce unique `Date` constraint. If user tries to create a log for an existing date, either:
- Redirect to edit existing log, or
- Return 409 Conflict and handle client-side

### Data Persistence
SQLite V1 (can migrate to SQL Server/Postgres later). Use Entity Framework Core migrations—always include migration files in commits for reproducibility.

## Development Focus Areas

1. **Backend**: Keep .NET API stateless and thin—let EF Core handle queries, use standard REST conventions
2. **Frontend**: React + Vite for clean separation and minimal overhead
   - Structure: `src/pages/`, `src/components/`, `src/services/`, `src/hooks/`
   - API service: Single `api.ts` file with fetch wrappers (no axios/tanstack/heavy deps to keep costs low)
   - State: useState for local state; fetch data on-demand for dashboard/lists
   - No routing library initially—use simple conditional rendering or lightweight router if needed
3. **UI**: Tailwind CSS only (zero-dependency, CDN-friendly or included in Vite build)—no Shadcn/MUI in V1
4. **Markdown Support**: Use `react-markdown` npm package for Note content rendering
5. **Whiteboard**: Embed Excalidraw npm package, store `ExcalidrawJson` string blob in DB
6. **Cost Strategy**: SQLite local database (free), Vite dev server (fast bundling), minimal npm dependencies

## V1 Definition of Done
✅ Add/edit/mark tasks  
✅ Write daily logs (unique per day)  
✅ Create/edit notes  
✅ Draw and save whiteboards  
✅ Quick capture functional  
✅ Data persists after restart  

No auth, no analytics, no integrations.
