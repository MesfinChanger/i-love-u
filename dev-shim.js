/**
 * @fileOverview Port Bridge Shim for Next.js 15 in Firebase Studio.
 * Synchronizes the application listener with the Firebase Studio nginx gateway.
 * Adheres to the Cloud Workstation PORT contract.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

// Determine port. Priority: 1. CLI --port, 2. Env PORT, 3. Default 3000
let port = process.env.PORT || '3000';

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--port' || arg === '-p') {
    port = rawArgs[i + 1];
    i++; // Skip the value
    continue;
  }
  if (arg === '--hostname' || arg === '--host') {
    i++; // Skip the value
    continue;
  }
  filteredArgs.push(arg);
}

// Re-inject the detected port and hostname to enforce the Cloud Workstation contract
const nextArgs = ['dev', ...filteredArgs, '--port', port, '--hostname', '0.0.0.0'];

console.log(`[I LOVE U Port Bridge] Synchronizing Infrastructure...`);
console.log(`[I LOVE U Port Bridge] Target: 0.0.0.0:${port}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Port Bridge] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

const child = spawn(nextBin, nextArgs, {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    PORT: port,
    HOSTNAME: '0.0.0.0',
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => {
    child.kill(signal);
  });
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`[I LOVE U Port Bridge] Next.js process terminated by signal ${signal}`);
  }
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Port Bridge] Infrastructure Boot Error:', err);
  process.exit(1);
});
