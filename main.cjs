const { app, BrowserWindow } = require('electron');

// تسجيل بدء التطبيق
console.log('Starting Electron app...');

// التأكد من أن Electron يعمل بشكل صحيح
if (require('electron')) {
  console.log('Electron loaded successfully');
} else {
  console.error('Electron failed to load');
  process.exit(1);
}

function createWindow() {
  console.log('Creating BrowserWindow...');
  
  try {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        // إضافة إعدادات إضافية
        backgroundThrottling: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        experimentalFeatures: true
      }
    });

    console.log('BrowserWindow created successfully');
    
    // تحميل ملف index.html
    console.log('Loading index.html...');
    win.loadFile('index.html');
    
    // فتح أدوات المطور
    console.log('Opening DevTools...');
    win.webContents.openDevTools();
    
    // إضافة مستمعين للأحداث
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    });
    
    win.webContents.on('did-finish-load', () => {
      console.log('Page loaded successfully');
    });
    
    win.on('closed', () => {
      console.log('Window closed');
    });
    
    return win;
  } catch (error) {
    console.error('Error creating window:', error);
    process.exit(1);
  }
}

// بدء التطبيق
app.whenReady()
  .then(() => {
    console.log('App is ready');
    return createWindow();
  })
  .then((win) => {
    console.log('Window created successfully');
    
    // إضافة مستمع للتحقق من أن النافذة لا تزال مفتوحة
    setTimeout(() => {
      if (win && !win.isDestroyed()) {
        console.log('Window is still open and healthy');
      } else {
        console.error('Window was destroyed unexpectedly');
      }
    }, 5000);
  })
  .catch((error) => {
    console.error('Failed to start app:', error);
    process.exit(1);
  });

// التعامل مع تفعيل التطبيق
app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// التعامل مع إغلاق جميع النوافذ
app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// التعامل مع إنهاء التطبيق
app.on('quit', () => {
  console.log('App quitting');
});

// التقاط أخطاء غير متوقعة
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});