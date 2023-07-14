const { BrowserWindow, components, app } = require('electron');
const { join } = require("path");

const SplashScreen = {
    splashWin: null,
    CreateWindow() {
        this.show()
        return SplashScreen
    },
    Destroy() {
        this.splashWin.destroy()
    },
    show: function () {
        this.splashWin = new BrowserWindow({
            icon: process.platform === "linux" ? join(__dirname, '../icons/icon.png') : join(__dirname, '../icons/icon.ico'),
            width: 300,
            height: 300,
            resizable: false,
            show: true,
            center: true,
            transparent: true,
            title: app.getName(),
            frame: false,
            thickFrame: false,
            experimentalFeatures: true,
            devTools: true,
            webviewTag: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
        this.splashWin.show()
        this.splashWin.loadFile("./resources/splash/index.html")
        this.splashWin.on("closed", () => {
            this.splashWin = null
        })
    }
}

module.exports = SplashScreen
