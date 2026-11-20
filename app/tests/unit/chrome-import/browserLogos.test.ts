import { describe, expect, it, vi } from 'vitest';
import { supportedChromiumBrowserKeys } from '../../../src/main/chrome-import/profiles';
import { browserLogoByKey } from '../../../src/renderer/shared/browserLogos';

vi.mock('../../../src/main/logger', () => ({
  mainLogger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

describe('browser logo mapping', () => {
  it('has a renderer logo for every supported browser key', () => {
    expect(Object.keys(browserLogoByKey).sort()).toEqual(supportedChromiumBrowserKeys().sort());
  });

  it('reuses the Google Chrome logo for Chrome Canary', () => {
    expect(browserLogoByKey['google-chrome-canary']).toBe(browserLogoByKey['google-chrome']);
  });
});
