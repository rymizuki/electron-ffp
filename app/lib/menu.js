'use strict'

const remote    = require('remote')
const Menu      = remote.require('menu')
const MenuItem  = remote.require('menu-item')

let menu = new Menu.buildFromTemplate([
  { label: 'Copy',  accelerator: 'Cmd+C', role: 'copy' },
  { label: 'Cut',   accelerator: 'Cmd+X', role: 'cut'  },
  { label: 'Paste', accelerator: 'Cmd+V', role: 'paste'},
])

window.addEventListener('contextmenu', function (ev) {
  ev.preventDefault()
  menu.popup(remote.getCurrentWindow)
}, false)
