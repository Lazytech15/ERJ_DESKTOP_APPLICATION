const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

// Path to the built Vite frontend (output of `frontend` build -> electron/dist)
const FRONTEND_DIST = path.join(__dirname, 'dist', 'index.html');
const DEV_SERVER_URL = 'http://localhost:5173';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#F5F0EB',
    show: false,
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(FRONTEND_DIST);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/* ════════════════════════════
   WINDOW CONTROLS
════════════════════════════ */
ipcMain.handle('app-version', () => app.getVersion());
ipcMain.handle('minimize-window', () => mainWindow?.minimize());
ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('close-window', () => mainWindow?.close());

/* ════════════════════════════
   ATTENDANCE DATA (stub backend)
   Replace these handlers with real
   database / API integration.
════════════════════════════ */

// In-memory demo state — swap out for a real DB / API integration.
let attendanceState = {
  online: true,
  employees: [
    { id: 25052, name: 'Jeremiah Cacao',          dept: 'Operations',  shift: 'MORNING', clockIn: '09:42', clockState: 'in', clockTimeDisplay: '9:42:47 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25061, name: 'Ralph Jeffrey Tumimbang', dept: 'Procurement', shift: 'MORNING', clockIn: '09:27', clockState: 'in', clockTimeDisplay: '9:27:12 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25034, name: 'Wilchor Catedrilla',      dept: 'Operations',  shift: 'MORNING', clockIn: '09:14', clockState: 'in', clockTimeDisplay: '9:14:05 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25019, name: 'Sandy Elias Imperial',    dept: 'Operations',  shift: 'MORNING', clockIn: '08:05', clockState: 'in', clockTimeDisplay: '8:05:33 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25047, name: 'Earl Joseph Victoria',    dept: 'Operations',  shift: 'MORNING', clockIn: '08:03', clockState: 'in', clockTimeDisplay: '8:03:48 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25038, name: 'Jan Elijah Ruiz',         dept: 'Operations',  shift: 'MORNING', clockIn: '08:03', clockState: 'in', clockTimeDisplay: '8:03:02 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25021, name: 'John David Andrade',      dept: 'Operations',  shift: 'MORNING', clockIn: '08:00', clockState: 'in', clockTimeDisplay: '8:00:19 AM', hoursRegular: 0, hoursOvertime: 0 },
    { id: 25055, name: 'Larry Felipe',            dept: 'Procurement', shift: 'MORNING', clockIn: '07:59', clockState: 'in', clockTimeDisplay: '7:59:44 AM', hoursRegular: 0, hoursOvertime: 0 },
  ],
  clockOuts: [],
  stats: {
    regularHours: 0,
    overtimeHours: 0,
    present: 44,
    late: 3,
    absent: 16,
  },
};

function broadcastState() {
  if (mainWindow) {
    mainWindow.webContents.send('attendance-update', attendanceState);
  }
}

function getCurrentTimeStr(date = new Date()) {
  let h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`;
}

function getCurrentTimeShort(date = new Date()) {
  let h = date.getHours(), m = date.getMinutes();
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}`;
}

ipcMain.handle('get-attendance-state', () => attendanceState);

ipcMain.handle('refresh-attendance', () => {
  // TODO: refetch from DB / remote API and replace attendanceState
  return attendanceState;
});

ipcMain.handle('scan-employee', (_event, { value, mode }) => {
  const employee = attendanceState.employees.find(
    (e) => String(e.id) === String(value) || e.name.toLowerCase().includes(String(value).toLowerCase())
  );
  return { employee: employee || null, mode };
});

ipcMain.handle('clock-action', (_event, { employeeId }) => {
  const idx = attendanceState.employees.findIndex((e) => e.id === employeeId);
  if (idx === -1) return { employee: null };

  const emp = attendanceState.employees[idx];
  const now = new Date();

  if (emp.clockState === 'in') {
    emp.clockState = 'out';
    emp.clockTimeDisplay = getCurrentTimeStr(now);
    emp.hoursRegular = 8;
    emp.hoursOvertime = 0;

    attendanceState.clockOuts = [
      {
        id: emp.id,
        name: emp.name,
        dept: emp.dept,
        shift: emp.shift,
        clockOut: getCurrentTimeShort(now),
      },
      ...attendanceState.clockOuts,
    ];
  } else {
    emp.clockState = 'in';
    emp.clockTimeDisplay = getCurrentTimeStr(now);
    emp.hoursRegular = 0;
    emp.hoursOvertime = 0;
  }

  attendanceState.employees[idx] = emp;
  broadcastState();

  return { employee: emp, clockOuts: attendanceState.clockOuts, stats: attendanceState.stats };
});

ipcMain.handle('open-settings', () => {
  // TODO: open a settings window / dialog
});

ipcMain.handle('open-employee-directory', () => {
  // TODO: open a full employee directory window
});
