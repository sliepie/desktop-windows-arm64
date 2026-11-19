import { describe, expect, it, vi } from 'vitest';

// enrichedPath asks the login shell for PATH on POSIX. Report no shell PATH so
// the result depends only on the inputs below, not on this machine's profile.
vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:child_process')>()),
  spawnSync: vi.fn(() => ({ status: 1, stdout: '' })),
}));
import { enrichedPath, resolveCliSpawn } from '../../src/main/hl/engines/pathEnrich';

describe('pathEnrich', () => {
  it('keeps Windows PATH semicolon-delimited and adds common user CLI dirs', () => {
    const result = enrichedPath('C:\\Windows\\System32;C:\\Tools', {
      platform: 'win32',
      homedir: 'C:\\Users\\Ada',
      env: {
        LOCALAPPDATA: 'C:\\Users\\Ada\\AppData\\Local',
      },
    });

    const parts = result.split(';');
    expect(parts.slice(0, 2)).toEqual(['C:\\Windows\\System32', 'C:\\Tools']);
    expect(parts).toContain('C:\\Users\\Ada\\AppData\\Roaming\\npm');
    expect(parts).toContain('C:\\Users\\Ada\\.bcode\\bin');
    expect(parts).toContain('C:\\Users\\Ada\\.cargo\\bin');
  });

  it('uses POSIX delimiters for Linux-style paths', () => {
    const result = enrichedPath('/usr/bin:/bin', {
      platform: 'linux',
      homedir: '/home/ada',
      env: {},
    });

    const parts = result.split(':');
    expect(parts.slice(0, 2)).toEqual(['/usr/bin', '/bin']);
    expect(parts).toContain('/home/ada/.local/bin');
    expect(parts).toContain('/home/ada/.cargo/bin');
  });

  it('leaves POSIX CLI execution shell-free', () => {
    const args = ['exec', '--json', '--dangerously-bypass-approvals-and-sandbox', '-'];

    expect(resolveCliSpawn('codex', args, { platform: 'linux' })).toEqual({
      command: 'codex',
      args,
      viaCmdShell: false,
      spawnOptions: {},
    });
  });
});
