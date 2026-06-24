
/**
 * @fileOverview Startup shim to resolve Next.js flag incompatibilities in Firebase Studio.
 * Robustly maps environment-injected '--host' flags to the supported '--hostname' parameter.
 */
const { spawn } = require('child_process');
const path = require('path');

// Filter and map arguments to resolve flag incompatibilities
const rawArgs = process.argv.slice(2);
const args = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  // If we encounter --host, we replace it with --hostname
  if (arg === '--host') {
    args.push('--hostname');
  } else {
    args.push(arg);
  }
}

// Ensure 0.0.0.0 is used if no hostname is specified to allow external container access
if (!args.includes('--hostname')) {
  args.push('--hostname', '0.0.0.0');
}

console.log(`[I LOVE U Shim] Booting Next.js with filtered parameters: ${args.join(' ')}`);

// Use the local next binary directly for maximum reliability
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

const child = spawn(nextBin, ['dev', ...args], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Shim] Failed to launch Next.js process:', err);
  process.exit(1);
});
