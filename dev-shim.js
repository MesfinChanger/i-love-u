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

// Enforce hostname 0.0.0.0 for container accessibility
if (!args.includes('--hostname') && !args.includes('--host') && !args.includes('-H')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Ensure port is present
if (portArgIdx === -1) {
  finalArgs.push('--port', port);
}

// Add all remaining arguments
args.forEach((arg, i) => {
  if (portArgIdx !== -1 && (i === portArgIdx || i === portArgIdx + 1)) return;
  finalArgs.push(arg);
});

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
