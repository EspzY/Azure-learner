// Keep framework telemetry disabled for every local/CI Next command.
process.env.NEXT_TELEMETRY_DISABLED = '1';
await import('next/dist/bin/next');
