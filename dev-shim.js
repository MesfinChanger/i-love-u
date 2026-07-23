/**
 * @fileOverview Hardened Port Bridge Shim for Next.js 15 in Firebase Studio.
 * Unconditionally forces binding to port 6000 and 0.0.0.0 for workstation proxy compatibility.
 * Injects PORT and HOSTNAME directly into the environment to bypass CLI argument overrides.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

// PREVIEW PORT PROTOCOL: Ensure we have the explicit flags for Next.js
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

console.log(`[I LOVE U Port Bridge] Synchronizing Infrastructure...`);
console.log(`[I LOVE U Port Bridge] Target: 0.0.0.0:6000`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Port Bridge] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

const child = spawn(nextBin, ['dev', ...filteredArgs], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    PORT: '6000',
    HOSTNAME: '0.0.0.0',
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
    console.log(`[I LOVE U Port Bridge] Next.js process terminated by signal ${signal}`);
  }
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Port Bridge] Infrastructure Boot Error:', err);
  process.exit(1);
});
