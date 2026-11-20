import { app } from 'electron';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/main/logger', () => ({
  mainLogger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { shouldSkipUpdates, supportsUpdates } = await import('../../../src/main/updater');

const originalNodeEnv = process.env.NODE_ENV;
const originalPackaged = app.isPackaged;

function setPackaged(value: boolean): void {
  Object.defineProperty(app, 'isPackaged', { value, configurable: true });
}

describe('shouldSkipUpdates', () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    setPackaged(originalPackaged);
  });

  it('returns true when app is not packaged', () => {
    process.env.NODE_ENV = 'production';
    setPackaged(false);
    expect(shouldSkipUpdates()).toBe(true);
  });

  it('returns true when NODE_ENV is not production', () => {
    process.env.NODE_ENV = 'development';
    setPackaged(true);
    expect(shouldSkipUpdates()).toBe(true);
  });

  it('returns false when packaged and production', () => {
    process.env.NODE_ENV = 'production';
    setPackaged(true);
    expect(shouldSkipUpdates()).toBe(false);
  });
});

describe('supportsUpdates', () => {
  it('supports macOS, Windows, and Linux AppImage update backends', () => {
    expect(supportsUpdates('darwin')).toBe(true);
    expect(supportsUpdates('win32')).toBe(true);
    expect(supportsUpdates('linux', {})).toBe(false);
    expect(supportsUpdates('linux', { APPIMAGE: '/tmp/Browser-Use.AppImage' })).toBe(true);
  });
});
