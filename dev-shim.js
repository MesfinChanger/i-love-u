/**
 * @fileOverview Transparent Port Bridge for Next.js 15.
 * Synchronizes the application listener with the Firebase Studio preview gateway.
 * Enforces hostname 0.0.0.0 and resolves dynamic port allocation.
 */
const { spawn } = require('child_process');
const path = require('path');

const rawArgs = process.argv.slice(2);

// PORT DISCOVERY
let port = '';
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--port' || rawArgs[i] === '-p') {
    port = rawArgs[i + 1];
    break;
  }
}

if (!port) port = process.env.PORT || '3000';

// Guard against Next.js reserved port 6000 (X11)
if (port === '6000') {
  console.warn('[I LOVE U Port Bridge] Port 6000 is reserved. Falling back to 3000.');
  port = '3000';
}

console.log(`[I LOVE U Port Bridge] PORT BRIDGE ACTIVE: ${port}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

// ARGUMENT ENFORCEMENT
const finalArgs = ['dev', ...rawArgs];

// Enforce hostname 0.0.0.0 for container accessibility
if (!rawArgs.includes('--hostname') && !rawArgs.includes('--host') && !rawArgs.includes('-H')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Enforce resolved port if not provided in CLI
if (!rawArgs.includes('--port') && !rawArgs.includes('-p')) {
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
  console.error('[I LOVE U Port Bridge] Infrastructure Boot Error:', err);
  process.exit(1);
});
