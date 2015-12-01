'use strict'

const app           = require('app')
const Menu          = require('menu')
const BrowserWindow = require('browser-window')
const CrashReporter = require('crash-reporter')

const main_html_path = 'file://'+__dirname+'/public/index.html'

CrashReporter.start()

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') app.quit()
})

var main_window = null
app.on('ready', function () {
  main_window = new BrowserWindow({width: 800, height: 600})
  main_window.loadURL(main_html_path)
  main_window.on('closed', function () {
    main_window = null
  })

  if (process.platform == 'darwin') {
    let menu = Menu.buildFromTemplate([
      {
        label: 'FFP',
        submenu: [
          { label: 'Quit', accelerator: 'Cmd+Q', click: function () { app.quit() }},
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Select All',  accelerator: 'Cmd+A', role: 'selectall' },
          { label: 'Copy',        accelerator: 'Cmd+C', role: 'copy'      },
          { label: 'Paste',       accelerator: 'Cmd+V', role: 'paste'     },
        ]
      }
    ])
    Menu.setApplicationMenu(menu)
  }
})
