const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getDashboardData, getAllRentals, getCustomers, getInventory, getPayments, createPayment, getAnalyticsData, updateCustomerNotes, createRental, updateRentalStatus, getMessagesData, sendMessage, getDocumentsData, uploadDocument, updateDocumentStatus, getSettingsData, saveSettingsData, addEmployee, triggerBackup } = require('./db.cjs');

let mainWindow = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1200,
    minHeight: 760,
    frame: false, // Frameless for custom titlebar
    backgroundColor: '#0F172A',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Graceful show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5183';

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Window control IPC
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

  // DB IPC handlers
  ipcMain.handle('get-dashboard-data', async () => {
    try {
      return await getDashboardData();
    } catch (err) {
      console.error('Failed to get dashboard data:', err);
      throw err;
    }
  });

  ipcMain.handle('get-all-rentals', async () => {
    try {
      return await getAllRentals();
    } catch (err) {
      console.error('Failed to get all rentals:', err);
      throw err;
    }
  });

  ipcMain.handle('get-customers', async () => {
    try {
      return await getCustomers();
    } catch (err) {
      console.error('Failed to get customers:', err);
      throw err;
    }
  });

  ipcMain.handle('get-inventory', async () => {
    try {
      return await getInventory();
    } catch (err) {
      console.error('Failed to get inventory:', err);
      throw err;
    }
  });

  ipcMain.handle('get-payments', async () => {
    try {
      return await getPayments();
    } catch (err) {
      console.error('Failed to get payments:', err);
      throw err;
    }
  });

  ipcMain.handle('create-payment', async (_, payment) => {
    try {
      return await createPayment(payment);
    } catch (err) {
      console.error('Failed to create payment:', err);
      throw err;
    }
  });

  ipcMain.handle('get-analytics-data', async () => {
    try {
      return await getAnalyticsData();
    } catch (err) {
      console.error('Failed to get analytics data:', err);
      throw err;
    }
  });

  ipcMain.handle('update-customer-notes', async (_, id, notes) => {
    try {
      return await updateCustomerNotes(id, notes);
    } catch (err) {
      console.error('Failed to update customer notes:', err);
      throw err;
    }
  });

  ipcMain.handle('create-rental', async (_, rental) => {
    try {
      return await createRental(rental);
    } catch (err) {
      console.error('Failed to create rental:', err);
      throw err;
    }
  });

  ipcMain.handle('update-rental-status', async (_, id, status, payment_status) => {
    try {
      return await updateRentalStatus(id, status, payment_status);
    } catch (err) {
      console.error('Failed to update rental:', err);
      throw err;
    }
  });

  ipcMain.handle('get-messages-data', async () => {
    try {
      return await getMessagesData();
    } catch (err) {
      console.error('Failed to get messages data:', err);
      throw err;
    }
  });

  ipcMain.handle('send-message', async (_, msg) => {
    try {
      return await sendMessage(msg);
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  });

  ipcMain.handle('get-documents-data', async () => {
    try {
      return await getDocumentsData();
    } catch (err) {
      console.error('Failed to get documents data:', err);
      throw err;
    }
  });

  ipcMain.handle('upload-document', async (_, doc) => {
    try {
      return await uploadDocument(doc);
    } catch (err) {
      console.error('Failed to upload document:', err);
      throw err;
    }
  });

  ipcMain.handle('update-document-status', async (_, id, status) => {
    try {
      return await updateDocumentStatus(id, status);
    } catch (err) {
      console.error('Failed to update document status:', err);
      throw err;
    }
  });

  ipcMain.handle('get-settings-data', async () => {
    try {
      return await getSettingsData();
    } catch (err) {
      console.error('Failed to get settings data:', err);
      throw err;
    }
  });

  ipcMain.handle('save-settings-data', async (_, settings) => {
    try {
      return await saveSettingsData(settings);
    } catch (err) {
      console.error('Failed to save settings data:', err);
      throw err;
    }
  });

  ipcMain.handle('add-employee', async (_, emp) => {
    try {
      return await addEmployee(emp);
    } catch (err) {
      console.error('Failed to add employee:', err);
      throw err;
    }
  });

  ipcMain.handle('trigger-backup', async () => {
    try {
      return await triggerBackup();
    } catch (err) {
      console.error('Failed to trigger backup:', err);
      throw err;
    }
  });
}

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
