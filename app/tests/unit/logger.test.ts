import { describe, it, expect, vi } from 'vitest';

// Importing the logger module creates the default channel loggers, which
// would create log directories. Stub fs so the pure helper loads without I/O.
vi.mock('node:fs', () => ({ default: { mkdirSync: vi.fn() } }));

const { sanitizeLogChannel } = await import('../../src/main/logger');

describe('sanitizeLogChannel', () => {
  it('keeps normal channel names stable', () => {
    expect(sanitizeLogChannel('browser')).toBe('browser');
    expect(sanitizeLogChannel('agent-task-abc_123')).toBe('agent-task-abc_123');
  });

  it('removes path traversal and filesystem separators', () => {
    expect(sanitizeLogChannel('../renderer/logs')).toBe('_renderer_logs');
  });

  it('falls back for empty or dot-only channel names', () => {
    expect(sanitizeLogChannel('')).toBe('log');
    expect(sanitizeLogChannel('...')).toBe('log');
  });
});
