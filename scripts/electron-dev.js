const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// Determine path to electron executable
const electronPath = require('electron');

console.log('🚀 Starting SecuScanX Vite Dev Server & Electron Desktop App...');

// 1. Spawn Vite dev server
const viteBin = path.join(__dirname, '../node_modules/vite/bin/vite.js');
const viteProcess = spawn(process.execPath, [viteBin], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: process.env
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
});

// 2. Function to poll localhost:5173 until ready
function checkViteReady(attempts = 0) {
  if (attempts > 30) {
    console.error('Timed out waiting for Vite dev server.');
    viteProcess.kill();
    process.exit(1);
  }

  http.get('http://localhost:5173', (res) => {
    console.log('✅ Vite Dev Server is ready! Launching SecuScanX Electron Window...');
    startElectron();
  }).on('error', () => {
    setTimeout(() => checkViteReady(attempts + 1), 500);
  });
}

// 3. Spawn Electron Main Process
function startElectron() {
  const electronProcess = spawn(electronPath, ['.', '--dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env
  });

  electronProcess.on('close', (code) => {
    console.log(`Electron closed with exit code ${code}. Stopping Vite...`);
    viteProcess.kill();
    process.exit(code || 0);
  });

  electronProcess.on('error', (err) => {
    console.error('Failed to launch Electron:', err);
    viteProcess.kill();
    process.exit(1);
  });
}

// Start polling
setTimeout(() => checkViteReady(), 1000);
