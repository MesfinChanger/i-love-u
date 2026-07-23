/**
 * @fileOverview High-Fidelity Port Bridge Translator for Next.js 15.
 * Correctly maps Firebase Studio CLI flags and translates --host to --hostname.
 */
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

let port = process.env.PORT || '3000';
let finalArgs = ['dev'];

/**
 * Argument Purification Logic
 * Strips platform-injected host/port flags to re-apply them correctly.
 */
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--port' || arg === '-p') {
    if (args[i + 1]) {
      port = args[i + 1];
      i++;
    }
    continue;
  }

  if (arg === '--host' || arg === '-H' || arg === '--hostname') {
    if (args[i + 1]) {
      i++;
    }
    continue;
  }

  finalArgs.push(arg);
}

// SECURITY: Guard against port 6000 (reserved for X11/Gateway)
if (port === '6000') {
  console.warn('[Port Bridge] Port 6000 is reserved. Falling back to 3000.');
  port = '3000';
}

// Enforce hostname 0.0.0.0 for container accessibility
finalArgs.push('--hostname', '0.0.0.0');

// Enforce the resolved port
finalArgs.push('--port', port);

console.log(`[Port Bridge] Initializing Next.js at 0.0.0.0:${port}`);

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
