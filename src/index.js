const path = require('path');
const { app, screen, dialog, BrowserWindow, BrowserView } = require('electron');

// const { debounce } = require('./utils/fun');
const { format } = require('./utils/date');

// 获取带系统时间的标题，方便查看任务时间
const getTitle = () => `微拍堂 ${format('MM-dd HH:mm:ss')}`;
// 根据主屏幕尺寸设置合适的窗口尺寸
const getSize = () => {
    const { height: sh = 900 } = screen.getPrimaryDisplay().bounds || {};
    // 减去适当的任务栏高度
    const height = sh - 100;
    // 合适的高度下16:9的尺寸
    return {
        // 16:9屏幕
        width: Math.round(height * (9 / 16)),
        height,
    };
};

const URL = 'https://xyh5.163.com/game/?channel=netease';

const createWindow = () => {
    let win = new BrowserWindow({
        title: getTitle(),
        ...getSize(),
        autoHideMenuBar: true,
        useContentSize: true,
        maximizable: false,
        resizable: false,
        show: false,
        icon: path.resolve(__dirname, './imgs/icon.png'),
    });

    // 定时器更新标题拦时间
    const interval = setInterval(() => {
        win && win.isVisible() && win.setTitle(getTitle());
    }, 1000);

    // 退出app时清空定时任务
    const quitApp = () => {
        clearInterval(interval);
        win = null;
        app.quit();
    };

    // 发生加载错误时提醒并退出app
    const quitOnError = () => {
        win.setBounds({ width: 0, height: 0 });
        win.show();
        dialog.showMessageBox({
            type: 'error',
            title: '错误',
            message: '加载失败，请稍候重试',
        }).then(() => {
            win.close();
        });
    };

    // 移除菜单栏
    win.removeMenu();

    // 利用BrowserView加载页面，方便定制窗口标题
    const view = new BrowserView();
    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, ...getSize() });

    // 移动窗口可根据窗口所在屏幕尺寸设置合适的新尺寸
    // win.on('moved', debounce(() => {
    //     if (win && view) {
    //         const bounds = getSize(win);
    //         win.setBounds(bounds);
    //         view.setBounds({ x: 0, y: 0, ...bounds });
    //     }
    // }));

    // 退出
    win.on('close', quitApp);

    // 加载错误尝试5次
    let times = 0;
    view.webContents.on('did-fail-load', () => {
        if (times >= 5) {
            quitOnError();
            return;
        }
        view.webContents.reload();
        times++;
    });

    // view加载成功时显示主窗口
    view.webContents.once('did-finish-load', () => {
        win.show();
    });

    view.webContents.loadURL(URL);
};

app.whenReady().then(createWindow);
