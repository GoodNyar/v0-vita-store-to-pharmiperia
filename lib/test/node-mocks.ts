import { mock, type MockModuleOptions } from 'node:test'

/** Stub `server-only` so node:test can import server modules (lib/orders, lib/events, etc.). */
export function mockServerOnlyModule(): void {
  mock.module('server-only', { namedExports: {} } satisfies MockModuleOptions)
}