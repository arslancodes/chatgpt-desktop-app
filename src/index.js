const { app, BrowserWindow, screen, Tray, Menu, MenuItem } = require('electron')
const path = require('path')

let mainWindow
let tray

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = screenWidth / 4; // Set window width to one third of the screen width
  const windowHeight = screenHeight; // Set window height to full screen height

  // Calculate the x position for the window to be on the extreme right
  const xPos = screenWidth - windowWidth;

  mainWindow = new BrowserWindow({
    x: xPos, // Set the x position
    y: 0, // Set the y position to 0
    width: windowWidth,
    height: windowHeight,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'assets/chatgpt.ico'),
    autoHideMenuBar: true,
    title: "My App",
    frame: false,
    resizable: false,
    transparent: true,
  });

  mainWindow.loadURL('https://chatgpt.com')

  // Show window when it's ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Hide the window when it's minimized
  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide()
  })

  // Destroy the window when closed
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  tray = new Tray(path.join(__dirname, 'assets/chatgpt.ico'))

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  const contextMenu = new Menu()
  contextMenu.append(new MenuItem({
    label: 'Exit',
    click: () => {
      mainWindow.close() // This will trigger the 'closed' event on the window
    }
  }))

  tray.setContextMenu(contextMenu)

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
