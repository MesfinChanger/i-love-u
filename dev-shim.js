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

// Determine port from environment or default to 3000
const port = process.env.PORT || '3000';

// Ensure we bind to all interfaces and use the correct port
filteredArgs.push('--port', port);
filteredArgs.push('--hostname', '0.0.0.0');

// Remove conflicting port/host flags from incoming CLI args
for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--port' || arg === '-p' || arg === '--hostname' || arg === '--host') {
    i++; // Skip the value
    continue;
  }
  filteredArgs.push(arg);
}

console.log(`[I LOVE U Port Bridge] Synchronizing Infrastructure...`);
console.log(`[I LOVE U Port Bridge] Target: 0.0.0.0:${port}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Port Bridge] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

const child = spawn(nextBin, ['dev', ...filteredArgs], {
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
