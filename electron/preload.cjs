const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // Database / Dashboard APIs
  getDashboardData: () => ipcRenderer.invoke('get-dashboard-data'),
  getAllRentals: () => ipcRenderer.invoke('get-all-rentals'),
  getCustomers: () => ipcRenderer.invoke('get-customers'),
  getInventory: () => ipcRenderer.invoke('get-inventory'),
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
  triggerBackup: () => ipcRenderer.invoke('trigger-backup'),
  updateCustomerNotes: (id, notes) => ipcRenderer.invoke('update-customer-notes', id, notes),
  createRental: (data) => ipcRenderer.invoke('create-rental', data),
  updateRentalStatus: (id, status, payment_status) => ipcRenderer.invoke('update-rental-status', id, status, payment_status),
  
  // Platform info
  platform: process.platform
});
