const path = require('path');
const { app, screen, BrowserWindow, BrowserView } = require('electron');

const { format } = require('./utils/date');

// 获取带系统时间的标题，方便查看任务时间
const getTitle = () => `西游网页版 ${format('MM-dd HH:mm:ss')}`;

// 根据主屏幕尺寸设置合适的窗口尺寸
const getSize = () => {
  const { height: sh = 800 } = screen.getPrimaryDisplay().bounds || {};
  // 减去适当的任务栏高度
  const height = sh - 120;
  // 合适的高度下16:9的尺寸
  return {
    // 16:9屏幕
    width: Math.round((height * (9 / 16)) / 2) * 2,
    height,
  };
};

const URL = 'https://xyh5.163.com/game/?channel=netease';

// 主窗口
const createWindow = async () => {
  let win = new BrowserWindow({
    title: getTitle(),
    ...getSize(),
    autoHideMenuBar: true,
    useContentSize: true,
    maximizable: false,
    resizable: true,
    show: false,
    minimizable: false,
  });
  // 移除菜单栏
  win.removeMenu();

  // 定时器更新标题拦时间
  let interval;
  const quitApp = () => {
    clearInterval(interval);
    win = null;
    app.quit();
  };

  const view = new BrowserView();
  const refreshViewBounds = () => {
    const { width, height } = win.getBounds();
    const vw = Math.round((height * (9 / 16)) / 2) * 2;
    view.setBounds({
      // 16:9屏幕
      width: Math.min(vw, width),
      height,
      x: Math.max(Math.round((width - vw) / 2), 0),
      y: 0,
    });
  };

  win.setBrowserView(view);
  view.setBounds({ width: 0, height: 0, x: 0, y: 0 });
  view.webContents.once('did-finish-load', refreshViewBounds);
  view.webContents.loadURL(URL);

  win.on('focus', () => {
    interval = setInterval(() => {
      win && win.isVisible() && win.setTitle(getTitle());
    }, 1000);
  });
  win.on('blur', () => {
    interval && clearInterval(interval);
  });
  win.on('resize', refreshViewBounds);
  win.on('resized', refreshViewBounds);
  win.on('close', quitApp);

  // 加载主页面
  await win.loadFile(path.resolve(__dirname, 'index.html'));
  win.show();
  // process.env.NODE_ENV === 'development' && win.webContents.openDevTools({ mode: 'undocked' });
};

app.whenReady().then(async () => {
  await createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// app.on('browser-window-blur', () => {});

// app.on('browser-window-focus', () => {});

// app.on('will-quit', () => {});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
