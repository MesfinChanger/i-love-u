/**
 * @fileOverview Transparent Port Bridge for Next.js 15.
 * Synchronizes the application listener with the Firebase Studio preview gateway.
 */
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

// ARGUMENT PARSING
const portArgIdx = args.findIndex(arg => arg === '--port' || arg === '-p');
let port = '3000';

if (portArgIdx !== -1 && args[portArgIdx + 1]) {
  port = args[portArgIdx + 1];
} else if (process.env.PORT) {
  port = process.env.PORT;
}

// SECURITY: Guard against port 6000 (reserved for X11/Gateway)
if (port === '6000') {
  console.warn('[Port Bridge] Port 6000 is reserved. Falling back to 3000.');
  port = '3000';
}

console.log(`[Port Bridge] Target: 0.0.0.0:${port}`);

// CONSTRUCT FINAL ARGUMENTS
let finalArgs = ['dev'];

/**
 * Translation Logic for Next.js 15
 * Next.js 15 CLI does not recognize --host. It requires --hostname.
 */
args.forEach((arg, i) => {
  // Skip the port argument and its value if found, we will re-add it at the end
  if (portArgIdx !== -1 && (i === portArgIdx || i === portArgIdx + 1)) return;

  // Translate --host or -H to --hostname
  if (arg === '--host' || arg === '-H') {
    finalArgs.push('--hostname');
  } else {
    finalArgs.push(arg);
  }
});

// Enforce hostname 0.0.0.0 for container accessibility if not provided
if (!finalArgs.some(a => a === '--hostname' || a === '-H')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Re-append the resolved port
if (!finalArgs.some(a => a === '--port' || a === '-p')) {
  finalArgs.push('--port', port);
}

const child = spawn(nextBin, finalArgs, {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

child.on('error', (err) => {
  console.error('[Port Bridge] Infrastructure Boot Error:', err);
  process.exit(1);
});
