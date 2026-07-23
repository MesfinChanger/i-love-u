/**
 * @fileOverview Hardened Port Bridge Shim for Next.js 15 in Firebase Studio.
 * Unconditionally forces binding to port 6000 and 0.0.0.0 for workstation proxy compatibility.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

// PREVIEW PORT PROTOCOL: Unconditionally force port 6000 and hostname 0.0.0.0
// This resolves the 502 Bad Gateway by aligning with the workstation proxy map.
filteredArgs.push('--port', '6000');
filteredArgs.push('--hostname', '0.0.0.0');

// Filter out any conflicting port/host flags from the original command
for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--port' || arg === '-p' || arg === '--hostname' || arg === '--host') {
    i++; // Skip the value
    continue;
  }
  filteredArgs.push(arg);
}

console.log(`[I LOVE U Port Bridge] Launching Next.js on 0.0.0.0:6000...`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Port Bridge] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

const child = spawn(nextBin, ['dev', ...filteredArgs], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development' 
  }
});

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => {
    child.kill(signal);
  });
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`[I LOVE U Port Bridge] Next.js exited with signal ${signal}`);
  }
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Port Bridge] Critical Boot Error:', err);
  process.exit(1);
});
