const {app, components, protocol, dialog} = require("electron"),
    {join, resolve} = require("path"),
    {existsSync, createReadStream, unlink, rmSync} = require("fs"),
    Store = require('electron-store'),
    electronLog = require('electron-log');

module.exports = () => {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Application Configuration Init
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    app.setPath("userData", join(app.getPath("appData"), app.name.replace(/\s/g, ''))) // Set Linux to use .cache instead of .config and remove the space as its annoying

    // Set the Theme List based on css files in themes directory
    app.userThemesPath = resolve(app.getPath('userData'), 'themes');
    app.userPluginsPath = resolve(app.getPath('userData'), 'plugins');
    let showIntro = false

    const migrationFunctions = {
        clearElectronPrefs: () => {
            if (existsSync(resolve(app.getPath('userData'), 'preferences.json'))) {
                unlink(resolve(app.getPath('userData'), 'preferences.json'), (err) => {
                    if (err) console.error(err)
                })
            }
            if (existsSync(resolve(app.getPath('userData'), 'Preferences'))) {
                unlink(resolve(app.getPath('userData'), 'Preferences'), (err) => {
                    if (err) console.error(err)
                })
            }
        },
        clearCache: () => {
            if (existsSync(resolve(app.getPath('userData'), 'Cache'))) {
                rmSync(resolve(app.getPath('userData'), 'Cache'), {recursive: true, force: true})
            }
        },
        showDevelopmentMessage: () => {
            app.whenReady().then(() => {
                dialog.showMessageBox({
                    title: "Version under Development!",
                    message: "This version is under development. Expect bugs and issues whilst using the application.",
                    type: "warning"
                })
            })
        }
    }
    const storeDefaults = {
        general: {
            storefront: "",
            incognitoMode: false,
            playbackNotifications: "minimized",
            trayTooltipSongName: true,
            startupPage: "browse",
            discordRPC: "ame-title",
            discordClearActivityOnPause: true,
            lastfm: false,
            lastfmRemoveFeaturingArtists: true,
            lastfmNowPlaying: true,
            analyticsEnabled: true,
            lastfmScrobbleDelay: 30,
            checkForUpdates: false
        },
        visual: {
            theme: "default",
            frameType: "",
            transparencyEffect: "",
            transparencyTheme: "appearance-based",
            transparencyDisableBlur: true,
            transparencyMaximumRefreshRate: "",
            streamerMode: false,
            removeUpsell: true,
            removeAppleLogo: false,
            removeFooter: true,
            removeScrollbars: false,
            useOperatingSystemAccent: false,
            albumartNPPLaylist: false,
            scaling: 1,
            yton: false,
            mxmon: false,
            mxmlanguage: "en"
        },
        audio: {
            audioQuality: "auto",
            seamlessAudioTransitions: false,
            castingBitDepth: '16',
            enableDLNA: false,
        },
        window: {
            appStartupBehavior: "",
            closeButtonMinimize: false,
            alwaysOnTop: false
        },
        advanced: {
            forceApplicationMode: "system",
            hardwareAcceleration: true,
            verboseLogging: false,
            autoUpdaterBetaBuilds: false,
            useBetaSite: false,
            preventMediaKeyHijacking: false,
            devToolsOnStartup: false,
            allowMultipleInstances: false,
            experimentalFeatures: true
        },
        tokens: {
            lastfm: ""
        }
    }
    const storeMigrations = {
        '>=3.0.0': store => {
            showIntro = true
        },

        '<3.0.0': store => {
            migrationFunctions.clearElectronPrefs()
            migrationFunctions.clearCache()
        //    migrationFunctions.showDevelopmentMessage()

        }
    }

    app.cfg = new Store({
        defaults: storeDefaults,
        migrations: storeMigrations
    })
    app.cfg.watch = true;
    app.isQuiting = false;

    protocol.registerSchemesAsPrivileged([
        { scheme: 'http', privileges: { standard: true, secure: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'file', privileges: { standard: true, secure: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'ameres', privileges: { bypassCSP: true, secure: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'themes', privileges: { bypassCSP: true, secure: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'plugins', privileges: { bypassCSP: true, secure: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'https', privileges: { standard: true, secure: true,  bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
        { scheme: 'mailto', privileges: { standard: true } },
       ]);
    app.whenReady().then(async () => {
        await components.whenReady();
        electronLog.info('components ready:', components.status());
        protocol.registerFileProtocol('themes', (request, callback) => {
            const url = request.url.substr(7)
            callback({
                path: join(app.userThemesPath, url.toLowerCase())
            })
        })
        protocol.registerFileProtocol('ameres', (request, callback) => {
            const url = request.url.substr(7)
            callback(createReadStream(join(join(__dirname, '../'), url.toLowerCase())))
        })
        protocol.registerFileProtocol('plugin', (request, callback) => {
            const url = request.url.substr(7)
            callback({
                path: join(app.userPluginsPath, url.toLowerCase())
            })
        })
    })

    const handlersFuncs = require('./handler'),
        initFuncs = require('./init'),
        loadFuncs = require('./load'),
        utilsFuncs = require('./utils'),
        winFuncs = require('./win'),
        discordFuncs = require('./media/discordrpc'),
        lastfmFuncs = require('./media/lastfm'),
        mprisFuncs = require('./media/mpris');

    return {
        handler: handlersFuncs,
        init: initFuncs,
        load: loadFuncs,
        utils: utilsFuncs,
        win: winFuncs,
        discord: discordFuncs,
        lastfm: lastfmFuncs,
        mpris: mprisFuncs,
        showOOBE: showIntro
    };
}
