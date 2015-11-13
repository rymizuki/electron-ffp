'use strict'

const remote    = require('remote')
const Menu      = remote.require('menu')
const MenuItem  = remote.require('menu-item')

let menu = new Menu.buildFromTemplate([
  { label: 'Copy',  accelerator: 'CmdOrCtrl+C', role: 'copy' },
  { label: 'Cut',   accelerator: 'CmdOrCtrl+X', role: 'cut'  },
  { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
])

window.addEventListener('contextmenu', function (ev) {
  ev.preventDefault()
  menu.popup(remote.getCurrentWindow)
}, false)
