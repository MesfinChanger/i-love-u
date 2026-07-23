/**
 * @fileOverview Transparent Port Bridge for Next.js 15.
 * Synchronizes the application listener with the Firebase Studio preview gateway.
 */
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

// PORT DISCOVERY
let port = '';
const portIdx = args.findIndex(a => a === '--port' || a === '-p');
if (portIdx !== -1 && args[portIdx + 1]) {
  port = args[portIdx + 1];
} else if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = '3000';
}

// Security: Guard against Next.js reserved port 6000 (X11)
if (port === '6000') {
  console.warn('[I LOVE U Port Bridge] Port 6000 is reserved. Falling back to 3000.');
  port = '3000';
}

console.log(`[I LOVE U Port Bridge] PORT BRIDGE ACTIVE: ${port}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

// ARGUMENT ENFORCEMENT
const finalArgs = ['dev', ...args];

// Enforce hostname 0.0.0.0 for container accessibility
if (!args.includes('--hostname') && !args.includes('--host') && !args.includes('-H')) {
  finalArgs.push('--hostname', '0.0.0.0');
}

// Ensure the port is correctly set if not already provided in CLI
if (portIdx === -1 && !args.includes('--port') && !args.includes('-p')) {
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
