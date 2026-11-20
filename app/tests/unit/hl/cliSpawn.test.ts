import { describe, expect, it, vi } from 'vitest';

const spawnSpy = vi.hoisted(() => vi.fn());

vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:child_process')>()),
  spawn: spawnSpy,
}));

const { spawnCli } = await import('../../../src/main/hl/engines/cliSpawn');

describe('spawnCli executable validation', () => {
  it('rejects shell metacharacters in executable names before spawning', () => {
    expect(() => spawnCli('codex;rm', [])).toThrow(/unsupported executable name/);
    expect(() => spawnCli('codex\nrm', [])).toThrow(/unsafe executable name/);
    expect(spawnSpy).not.toHaveBeenCalled();
  });
});
