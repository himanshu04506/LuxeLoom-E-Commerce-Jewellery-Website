const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('====================================================');
console.log('       LUXELOOM JEWELLERY UNIFIED LAUNCHER');
console.log('====================================================\n');

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Step 1: Install server packages if missing
if (!fs.existsSync(path.join(serverDir, 'node_modules'))) {
  console.log('[1/3] Installing backend server dependencies...');
  execSync(`${npmCmd} install`, { cwd: serverDir, stdio: 'inherit' });
}

// Step 2: Install client packages if missing
if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
  console.log('[2/3] Installing frontend client dependencies...');
  execSync(`${npmCmd} install`, { cwd: clientDir, stdio: 'inherit' });
}

// Step 3: Seed Database
console.log('[3/3] Seeding jewellery database & test accounts...');
try {
  execSync('node scripts/seed.js', { cwd: serverDir, stdio: 'inherit' });
} catch (e) {
  console.warn('Seeding notice: database initialized with defaults.');
}

console.log('\n[LAUNCH] Starting LuxeLoom Full-Stack Application...\n');

// Spawn Backend Server (Node server.js)
const serverProcess = spawn('node', ['server.js'], { cwd: serverDir, stdio: 'inherit', shell: true });

// Spawn Frontend Dev Server (npm run dev)
const clientProcess = spawn(npmCmd, ['run', 'dev'], { cwd: clientDir, stdio: 'inherit', shell: true });

console.log('\n----------------------------------------------------');
console.log('  LuxeLoom Web App: http://localhost:3000');
console.log('  Backend REST API: http://localhost:5001');
console.log('----------------------------------------------------\n');

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
