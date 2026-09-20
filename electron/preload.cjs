const { contextBridge, ipcRenderer } = require('electron');

// ─── Step 3: Disable right-click context menu in renderer ─────────────────────
// (Allow it only in dev so we can still inspect elements)
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// ─── Step 3: Prevent image drag / ghost dragging ─────────────────────────────
window.addEventListener('dragstart', (e) => {
  if (e.target && e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// ─── Expose safe API to renderer ─────────────────────────────────────────────
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Step 1: Window controls ──────────────────────────────────────────────
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  /**
   * Step 1: Subscribe to maximize state changes pushed from main process.
   * React uses this to update the maximize/restore button icon in real time,
   * even when the user snaps windows via Win+Arrow or Aero Snap.
   * Returns an unsubscribe function to call on component unmount.
   */
  onMaximizeChange: (callback) => {
    const handler = (_event, isMaximized) => callback(isMaximized);
    ipcRenderer.on('window-maximize-change', handler);
    return () => ipcRenderer.removeListener('window-maximize-change', handler);
  },

  /**
   * Step 2: Subscribe to native menu actions pushed from main process.
   * The native menu sends events like ('navigate', 'rentals') or ('search').
   * React App.tsx listens and performs the navigation / action.
   * Returns an unsubscribe function.
   */
  onMenuAction: (callback) => {
    const handler = (_event, action, payload) => callback(action, payload);
    ipcRenderer.on('menu-action', handler);
    return () => ipcRenderer.removeListener('menu-action', handler);
  },

  // ── Step 4: Native file dialogs ──────────────────────────────────────────
  /**
   * Show a native Windows "Open File" dialog.
   * @param {Electron.OpenDialogOptions} options
   * @returns {Promise<Electron.OpenDialogReturnValue>}
   */
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

  /**
   * Show a native Windows "Save As" dialog.
   * @param {Electron.SaveDialogOptions} options
   * @returns {Promise<Electron.SaveDialogReturnValue>}
   */
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),

  /**
   * Open a file in its native OS-registered application (e.g., PDF in Adobe Reader).
   */
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),

  // ── Database APIs ─────────────────────────────────────────────────────────
  getDashboardData: () => ipcRenderer.invoke('get-dashboard-data'),
  getAllRentals: () => ipcRenderer.invoke('get-all-rentals'),
  getCustomers: () => ipcRenderer.invoke('get-customers'),
  createCustomer: (data) => ipcRenderer.invoke('create-customer', data),
  updateCustomer: (id, data) => ipcRenderer.invoke('update-customer', id, data),
  getInventory: () => ipcRenderer.invoke('get-inventory'),
  createInventoryItem: (item) => ipcRenderer.invoke('create-inventory-item', item),
  updateInventoryItem: (id, item) => ipcRenderer.invoke('update-inventory-item', id, item),
  deleteInventoryItem: (id) => ipcRenderer.invoke('delete-inventory-item', id),
  getPayments: () => ipcRenderer.invoke('get-payments'),
  createPayment: (data) => ipcRenderer.invoke('create-payment', data),
  getAnalyticsData: () => ipcRenderer.invoke('get-analytics-data'),
  getMessagesData: () => ipcRenderer.invoke('get-messages-data'),
  sendMessage: (msg) => ipcRenderer.invoke('send-message', msg),
  getDocumentsData: () => ipcRenderer.invoke('get-documents-data'),
  uploadDocument: (data) => ipcRenderer.invoke('upload-document', data),
  updateDocumentStatus: (id, status) => ipcRenderer.invoke('update-document-status', id, status),
  getSettingsData: () => ipcRenderer.invoke('get-settings-data'),
  saveSettingsData: (settings) => ipcRenderer.invoke('save-settings-data', settings),
  addEmployee: (emp) => ipcRenderer.invoke('add-employee', emp),
  updateEmployee: (id, name, role, email, status, phone) => ipcRenderer.invoke('update-employee', id, name, role, email, status, phone),
  removeEmployee: (id) => ipcRenderer.invoke('remove-employee', id),
  triggerBackup: () => ipcRenderer.invoke('trigger-backup'),
  updateCustomerNotes: (id, notes) => ipcRenderer.invoke('update-customer-notes', id, notes),
  updateCustomerVerification: (id, status) => ipcRenderer.invoke('update-customer-verification', id, status),
  deleteCustomer: (id) => ipcRenderer.invoke('delete-customer', id),
  getAppConfig: () => ipcRenderer.invoke('get-app-config'),
  saveAppConfig: (config) => ipcRenderer.invoke('save-app-config', config),
  updatePaymentStatus: (id, status) => ipcRenderer.invoke('update-payment-status', id, status),
  createRental: (data) => ipcRenderer.invoke('create-rental', data),
  updateRentalStatus: (id, status, payment_status) =>
    ipcRenderer.invoke('update-rental-status', id, status, payment_status),

  // Platform info
  platform: process.platform,
});
