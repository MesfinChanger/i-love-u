
/**
 * @fileOverview Startup shim to resolve Next.js flag incompatibilities in Firebase Studio.
 * Corrects the unsupported '--host' flag to '--hostname'.
 */
const { spawn } = require('child_process');

// Filter and map arguments to resolve flag incompatibilities
const rawArgs = process.argv.slice(2);
const args = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    args.push('--hostname');
  } else {
    args.push(arg);
  }
}

// Ensure a default hostname if not provided to allow network access within containers
if (!args.includes('--hostname')) {
  args.push('--hostname', '0.0.0.0');
}

console.log(`[I LOVE U Shim] Launching Next.js with filtered args: ${args.join(' ')}`);

const child = spawn('npx', ['next', 'dev', ...args], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
