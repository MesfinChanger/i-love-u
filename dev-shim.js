/**
 * @fileOverview Hardened startup shim for Next.js 15 in Firebase Studio.
 * Corrects flag incompatibilities and ensures a resilient network bind.
 */
const { spawn } = require('child_process');
const path = require('path');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  
  // Intercept the unsupported --host flag
  if (arg === '--host') {
    if (!filteredArgs.includes('--hostname')) {
      filteredArgs.push('--hostname');
      // Look ahead for value
      const nextArg = rawArgs[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        filteredArgs.push(nextArg);
        i++; // skip the value in next iteration
      } else {
        filteredArgs.push('0.0.0.0');
      }
    }
  } else if (arg === '--hostname') {
    if (!filteredArgs.includes('--hostname')) {
      filteredArgs.push(arg);
      const nextArg = rawArgs[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        filteredArgs.push(nextArg);
        i++;
      }
    }
  } else {
    filteredArgs.push(arg);
  }
}

// Ensure binding for container connectivity
if (!filteredArgs.includes('--hostname')) {
  filteredArgs.push('--hostname', '0.0.0.0');
}

// Default port protocol
if (!filteredArgs.includes('--port') && !filteredArgs.includes('-p')) {
  filteredArgs.push('--port', '3000');
}

console.log(`[I LOVE U Shim] Intercepted environment parameters. Launching Next.js with: ${filteredArgs.join(' ')}`);

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

const child = spawn(nextBin, ['dev', ...filteredArgs], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development' 
  }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[I LOVE U Shim] Critical Boot Error:', err);
  process.exit(1);
});
