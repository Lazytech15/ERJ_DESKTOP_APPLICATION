# Commands

Run these from the project root: `erj-attendance/`

## 1. Install dependencies (first time only)
```bash
npm install
```
This installs root (Electron) deps and frontend (React/Vite) deps automatically.

If `postinstall` doesn't trigger the frontend install for any reason, run it manually:
```bash
npm --prefix frontend install
```

---

## 2. Development (hot reload)
Starts the Vite dev server and Electron together. Changes to React code reload instantly.
```bash
npm run dev
```

---

## 3. Run as a production-style app (no installer)
Builds the React frontend into `electron/dist`, then launches Electron pointing at the built files.
```bash
npm start
```

---

## 4. Build a distributable (installer / executable)
Builds the frontend, then packages the Electron app with `electron-builder`.

```bash
npm run dist
```
Output goes to `dist-electron/` (e.g. `ERJ Smart Solution Attendance-2.6.1-Setup.exe` on Windows, `.dmg` on macOS, `.AppImage` on Linux).

### Variants
```bash
npm run build     # same as dist, but uses the "build" target/config
npm run release   # builds AND publishes (requires GitHub publish config/credentials)
```

---

## 5. Frontend-only commands (optional)
If you want to work on the UI in a regular browser (no Electron window):
```bash
cd frontend
npm run dev       # Vite dev server only, http://localhost:5173
npm run build     # build to ../electron/dist
npm run preview   # preview the production build
```

---

## Quick reference

| Goal                          | Command         |
|-------------------------------|------------------|
| First-time setup              | `npm install`    |
| Dev with hot reload            | `npm run dev`    |
| Run built app locally          | `npm start`      |
| Create installer/executable    | `npm run dist`   |