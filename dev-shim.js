/**
 * @fileOverview Hardened startup shim for Next.js 15 in Firebase Studio.
 * Corrects flag incompatibilities and ensures a resilient network bind.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  
  // Intercept the unsupported --host flag and convert to --hostname
  if (arg === '--host') {
    filteredArgs.push('--hostname');
    const nextArg = rawArgs[i + 1];
    if (nextArg && !nextArg.startsWith('--')) {
      filteredArgs.push(nextArg);
      i++;
    } else {
      filteredArgs.push('0.0.0.0');
    }
  } else if (arg === '--hostname') {
    filteredArgs.push(arg);
    const nextArg = rawArgs[i + 1];
    if (nextArg && !nextArg.startsWith('--')) {
      filteredArgs.push(nextArg);
      i++;
    }
  } else {
    filteredArgs.push(arg);
  }
}

// Ensure binding for container connectivity (mandatory for Firebase Studio)
if (!filteredArgs.includes('--hostname')) {
  filteredArgs.push('--hostname', '0.0.0.0');
}

// Default port protocol
if (!filteredArgs.includes('--port') && !filteredArgs.includes('-p')) {
  filteredArgs.push('--port', '3000');
}

console.log(`[I LOVE U Shim] Launching Next.js 15 with: ${filteredArgs.join(' ')}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.error(`[I LOVE U Shim] Error: Next.js binary not found at ${nextBin}`);
  process.exit(1);
}

// Use spawn without shell: true for better process tracking and signal propagation
const child = spawn(nextBin, ['dev', ...filteredArgs], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development' 
  }
});

// Relay signals to the child process
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => {
    child.kill(signal);
  });
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`[I LOVE U Shim] Next.js exited with signal ${signal}`);
  }
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Shim] Critical Boot Error:', err);
  process.exit(1);
});
