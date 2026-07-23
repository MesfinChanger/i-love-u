/**
 * @fileOverview Transparent Port Bridge for Next.js 15.
 * Translates legacy CLI flags and synchronizes the application listener 
 * with the Firebase Studio preview gateway.
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
 * High-Fidelity Translation Logic
 * Next.js 15+ CLI strictly requires --hostname instead of --host.
 */
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  // Skip port arguments as we re-inject them at the end for consistency
  if (i === portArgIdx || (portArgIdx !== -1 && i === portArgIdx + 1)) {
    continue;
  }

  // Translate host flags to hostname
  if (arg === '--host' || arg === '-H') {
    finalArgs.push('--hostname');
  } else {
    finalArgs.push(arg);
  }
}

// Enforce hostname 0.0.0.0 for container accessibility if not explicitly provided
if (!finalArgs.includes('--hostname')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Enforce the resolved port
if (!finalArgs.includes('--port')) {
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
