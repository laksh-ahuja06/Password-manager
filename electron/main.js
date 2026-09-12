const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let nextServer;

function startNextServer() {
  const serverPath = path.join(
      __dirname,
      "..",
      ".next",
      "standalone",
      "server.js"
  );

    nextServer = spawn(process.execPath, [serverPath], {
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: "1",
            PORT: "3000",
            HOSTNAME: "127.0.0.1",
        },
    });

    nextServer.stdout.on("data", (data) => {
        console.log(`Next.js: ${data}`);
    });

    nextServer.stderr.on("data", (data) => {
        console.error(`Next.js error: ${data}`);
    });
}

function waitForServer(callback) {
    const request = http.get("http://127.0.0.1:3000", () => {
        callback();
    });

    request.on("error", () => {
        setTimeout(() => waitForServer(callback), 200);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
    });

    waitForServer(() => {
        win.loadURL("http://127.0.0.1:3000");
    });
}

app.whenReady().then(() => {
    startNextServer();
    createWindow();
});

app.on("window-all-closed", () => {
    if (nextServer) {
        nextServer.kill();
    }

    if (process.platform !== "darwin") {
        app.quit();
    }
});
