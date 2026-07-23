/**
 * @fileOverview High-Fidelity Port Bridge Shim for Next.js 15.
 * Synchronizes the application listener with the Firebase Studio nginx gateway.
 * Specifically hardened to handle dynamic port injection via environment or CLI.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawArgs = process.argv.slice(2);

// PORT DISCOVERY PROTOCOL
// Priority: 1. CLI --port, 2. Env PORT, 3. Default 3000
let resolvedPort = process.env.PORT || '3000';

for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--port' || rawArgs[i] === '-p') {
    if (rawArgs[i + 1]) {
      resolvedPort = rawArgs[i + 1];
    }
    break;
  }
}

console.log(`[I LOVE U Port Bridge] PORT BRIDGE ACTIVE: ${resolvedPort}`);
console.log(`[I LOVE U Port Bridge] Target: 0.0.0.0:${resolvedPort}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Port Bridge] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

// ARGUMENT PURIFICATION
// Filter out host/port flags from forwarded args to prevent Next.js initialization conflicts
const filteredArgs = [];
for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--port' || arg === '-p' || arg === '--hostname' || arg === '--host' || arg === '-H') {
    i++; // Skip the flag value
    continue;
  }
  filteredArgs.push(arg);
}

// CONSTRUCT FINAL COMMAND
// Enforce the Cloud Workstation contract: 0.0.0.0 and resolvedPort
const nextArgs = ['dev', ...filteredArgs, '--port', resolvedPort, '--hostname', '0.0.0.0'];

const child = spawn(nextBin, nextArgs, {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    PORT: resolvedPort,
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
