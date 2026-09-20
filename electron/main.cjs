const { app, BrowserWindow, ipcMain, Menu, dialog, shell, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');

const {
  initDatabase,
  getDashboardData,
  getAllRentals,
  getCustomers,
  createCustomer,
  updateCustomer,
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getPayments,
  createPayment,
  getAnalyticsData,
  updateCustomerNotes,
  updateCustomerVerification,
  deleteCustomer,
  createRental,
  updateRentalStatus,
  getMessagesData,
  sendMessage,
  getDocumentsData,
  uploadDocument,
  updateDocumentStatus,
  getSettingsData,
  saveSettingsData,
  addEmployee,
  getAppConfig,
  saveAppConfig,
  updatePaymentStatus,
  updateEmployee,
  removeEmployee,
  triggerBackup,
} = require('./db.cjs');

// ─── Window State Store ────────────────────────────────────────────────────────
const store = new Store({
  defaults: {
    windowBounds: { x: undefined, y: undefined, width: 1440, height: 920 },
    windowMaximized: false,
  },
});

let mainWindow = null;

// ─── Create Main Window ────────────────────────────────────────────────────────
async function createWindow() {
  const { x, y, width, height } = store.get('windowBounds');
  const wasMaximized = store.get('windowMaximized');

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    minWidth: 1200,
    minHeight: 760,
    title: 'CameraHub',
    icon: path.join(__dirname, '../public/icon.ico'),
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0B0F17',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // ── Step 3: Disable zoom ──────────────────────────────────────────────
      zoomFactor: 1.0,
    },
  });

  // ── Step 4: Restore maximized state ──────────────────────────────────────
  if (wasMaximized) {
    mainWindow.maximize();
  }

  // Graceful show — prevents white flash on startup
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // ── Step 3: Lock zoom level to 1.0 (no Ctrl+/- zoom) ─────────────────
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  });

  // ── Step 1: Push maximize/unmaximize state to renderer ───────────────────
  mainWindow.on('maximize', () => {
    if (mainWindow) mainWindow.webContents.send('window-maximize-change', true);
  });
  mainWindow.on('unmaximize', () => {
    if (mainWindow) mainWindow.webContents.send('window-maximize-change', false);
  });

  // ── Step 4: Save window state on close ───────────────────────────────────
  mainWindow.on('close', () => {
    if (!mainWindow) return;
    store.set('windowMaximized', mainWindow.isMaximized());
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
      store.set('windowBounds', mainWindow.getBounds());
    }
  });

  // ── Step 3: Block zoom via keyboard in webContents ───────────────────────
  mainWindow.webContents.on('zoom-changed', (event, zoomDirection) => {
    mainWindow.webContents.setZoomFactor(1.0);
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5183';

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
    // Uncomment below to open DevTools automatically in dev:
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // ── Step 2: Build the native application menu ─────────────────────────────
  buildAppMenu();

  // ── Step 1: Window Control IPC (from React title bar) ────────────────────
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window-is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // ── Step 4: Native File Dialog IPC ───────────────────────────────────────
  ipcMain.handle('show-open-dialog', async (_, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  });

  ipcMain.handle('show-save-dialog', async (_, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  });

  // ── Step 4: Open file in native OS app (e.g., PDF viewer) ────────────────
  ipcMain.handle('open-path', async (_, filePath) => {
    return shell.openPath(filePath);
  });

  // ─── DB IPC Handlers ───────────────────────────────────────────────────────
  ipcMain.handle('get-dashboard-data', async () => {
    try { return await getDashboardData(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-all-rentals', async () => {
    try { return await getAllRentals(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-customers', async () => {
    try { return await getCustomers(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('create-customer', async (_, customer) => {
    try { return await createCustomer(customer); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-customer', async (_, id, customer) => {
    try { return await updateCustomer(id, customer); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-inventory', async () => {
    try { return await getInventory(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('create-inventory-item', async (_, item) => {
    try { return await createInventoryItem(item); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-inventory-item', async (_, id, item) => {
    try { return await updateInventoryItem(id, item); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('delete-inventory-item', async (_, id) => {
    try { return await deleteInventoryItem(id); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-payments', async () => {
    try { return await getPayments(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('create-payment', async (_, payment) => {
    try { return await createPayment(payment); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-analytics-data', async () => {
    try { return await getAnalyticsData(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-customer-notes', async (_, id, notes) => {
    try { return await updateCustomerNotes(id, notes); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-customer-verification', async (_, id, status) => {
    try { return await updateCustomerVerification(id, status); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('delete-customer', async (_, id) => {
    try { return await deleteCustomer(id); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('create-rental', async (_, rental) => {
    try { return await createRental(rental); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-rental-status', async (_, id, status, payment_status) => {
    try { return await updateRentalStatus(id, status, payment_status); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-messages-data', async () => {
    try { return await getMessagesData(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('send-message', async (_, msg) => {
    try { return await sendMessage(msg); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-documents-data', async () => {
    try { return await getDocumentsData(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('upload-document', async (_, doc) => {
    try { return await uploadDocument(doc); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-document-status', async (_, id, status) => {
    try { return await updateDocumentStatus(id, status); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-settings-data', async () => {
    try { return await getSettingsData(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('save-settings-data', async (_, settings) => {
    try { return await saveSettingsData(settings); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('add-employee', async (_, emp) => {
    try { return await addEmployee(emp); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('get-app-config', async () => {
    try { return await getAppConfig(); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('save-app-config', async (_, config) => {
    try { return await saveAppConfig(config); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-payment-status', async (_, id, status) => {
    try { return await updatePaymentStatus(id, status); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('update-employee', async (_, id, name, role, email, status, phone) => {
    try { return await updateEmployee(id, name, role, email, status, phone); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('remove-employee', async (_, id) => {
    try { return await removeEmployee(id); } catch (err) { console.error(err); throw err; }
  });
  ipcMain.handle('trigger-backup', async () => {
    try { return await triggerBackup(); } catch (err) { console.error(err); throw err; }
  });
}

// ─── Step 2: Native Application Menu ─────────────────────────────────────────
function buildAppMenu() {
  const isMac = process.platform === 'darwin';

  const sendToRenderer = (channel, ...args) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(channel, ...args);
    }
  };

  const template = [
    // ── File ──────────────────────────────────────────────────────────────
    {
      label: 'File',
      submenu: [
        {
          label: 'New Rental',
          accelerator: 'CmdOrCtrl+N',
          click: () => sendToRenderer('menu-action', 'navigate', 'new-rental'),
        },
        { type: 'separator' },
        {
          label: 'Export Data…',
          accelerator: 'CmdOrCtrl+E',
          click: () => sendToRenderer('menu-action', 'export'),
        },
        {
          label: 'Import Data…',
          accelerator: 'CmdOrCtrl+I',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: 'Import Data',
              filters: [{ name: 'JSON / CSV', extensions: ['json', 'csv'] }],
              properties: ['openFile'],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              sendToRenderer('menu-action', 'import', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Backup Now',
          accelerator: 'CmdOrCtrl+B',
          click: () => sendToRenderer('menu-action', 'backup'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', label: 'Exit', accelerator: 'Alt+F4' },
      ],
    },

    // ── Edit ──────────────────────────────────────────────────────────────
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
        { role: 'redo', accelerator: 'CmdOrCtrl+Y' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Quick Search',
          accelerator: 'CmdOrCtrl+K',
          click: () => sendToRenderer('menu-action', 'search'),
        },
      ],
    },

    // ── View ──────────────────────────────────────────────────────────────
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => sendToRenderer('menu-action', 'navigate', 'dashboard'),
        },
        {
          label: 'Rentals',
          accelerator: 'CmdOrCtrl+2',
          click: () => sendToRenderer('menu-action', 'navigate', 'rentals'),
        },
        {
          label: 'Customers',
          accelerator: 'CmdOrCtrl+3',
          click: () => sendToRenderer('menu-action', 'navigate', 'customers'),
        },
        {
          label: 'Inventory',
          accelerator: 'CmdOrCtrl+4',
          click: () => sendToRenderer('menu-action', 'navigate', 'inventory'),
        },
        {
          label: 'Payments',
          accelerator: 'CmdOrCtrl+5',
          click: () => sendToRenderer('menu-action', 'navigate', 'payments'),
        },
        {
          label: 'Analytics',
          accelerator: 'CmdOrCtrl+6',
          click: () => sendToRenderer('menu-action', 'navigate', 'analytics'),
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              const isFullScreen = mainWindow.isFullScreen();
              mainWindow.setFullScreen(!isFullScreen);
            }
          },
        },
        { type: 'separator' },
        // Only show DevTools in development
        ...(process.env.NODE_ENV === 'development' || !app.isPackaged
          ? [{ role: 'toggleDevTools', accelerator: 'F12' }]
          : []),
      ],
    },

    // ── Window ────────────────────────────────────────────────────────────
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', accelerator: 'CmdOrCtrl+M' },
        {
          label: 'Maximize / Restore',
          accelerator: 'CmdOrCtrl+Shift+M',
          click: () => {
            if (!mainWindow) return;
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
          },
        },
        { type: 'separator' },
        { role: 'reload', accelerator: 'CmdOrCtrl+R' },
        { role: 'forceReload', accelerator: 'CmdOrCtrl+Shift+R' },
      ],
    },

    // ── Help ──────────────────────────────────────────────────────────────
    {
      label: 'Help',
      submenu: [
        {
          label: 'About CameraHub',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About CameraHub',
              message: 'CameraHub',
              detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode.js: ${process.versions.node}\nPlatform: ${process.platform}`,
              buttons: ['OK'],
              icon: path.join(__dirname, '../public/camerahublogo.png'),
            });
          },
        },
        {
          label: 'Open Data Folder',
          click: () => shell.openPath(app.getPath('userData')),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ─── App Lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    await initDatabase(app.getPath('userData'));
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up global shortcuts on quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
