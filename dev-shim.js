
/**
 * @fileOverview High-Fidelity Port Bridge for Next.js 15.
 * Correctly maps Firebase Studio / Cloud Workstation port contracts and translates CLI flags.
 */
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

// ARGUMENT PARSING: Respect platform injection
let port = process.env.PORT || '3000';
let finalArgs = ['dev'];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  // Map --port correctly
  if (arg === '--port' || arg === '-p') {
    if (args[i + 1]) {
      port = args[i + 1];
      i++;
    }
    continue;
  }

  // TRANSLATION: Next.js 15 requires --hostname instead of --host
  if (arg === '--host' || arg === '-H') {
    finalArgs.push('--hostname');
    continue;
  }

  finalArgs.push(arg);
}

// SECURITY: Guard against port 6000 (reserved for X11/Gateway)
if (port === '6000') {
  console.warn('[Port Bridge] Port 6000 is reserved. Falling back to 3000.');
  port = '3000';
}

// Enforce hostname 0.0.0.0 for container accessibility if not explicitly provided
if (!finalArgs.includes('--hostname')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Enforce the resolved port
if (!finalArgs.includes('--port')) {
  finalArgs.push('--port', port);
}

console.log(`[Port Bridge] Target: 0.0.0.0:${port}`);

const child = spawn(nextBin, finalArgs, {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    PORT: port,
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

child.on('error', (err) => {
  console.error('[Port Bridge] Infrastructure Boot Error:', err);
  process.exit(1);
});
