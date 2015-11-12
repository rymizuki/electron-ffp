'use strict'

const app           = require('app')
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
  main_window.loadUrl(main_html_path)
  main_window.on('closed', function () {
    main_window = null
  })
})
