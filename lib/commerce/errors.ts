/**
 * Typed commerce-layer errors (ADR-0004, Playbook §1.3).
 * Callers MUST NOT swallow these and return empty data.
 */

export type CommerceErrorCode =
  | 'not_found'
  | 'forbidden'
  | 'validation'
  | 'conflict'
  | 'unavailable'
  | 'database'
  | 'unknown'

export class CommerceError extends Error {
  readonly code: CommerceErrorCode
  readonly cause?: unknown

  constructor(code: CommerceErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'CommerceError'
    this.code = code
    this.cause = cause
  }
}

export function commerceNotFound(resource: string, id?: string): CommerceError {
  const detail = id ? `${resource} (${id})` : resource
  return new CommerceError('not_found', `${detail} not found`)
}

export function commerceValidation(message: string): CommerceError {
  return new CommerceError('validation', message)
}

export function commerceDatabase(message: string, cause?: unknown): CommerceError {
  return new CommerceError('database', message, cause)
}

export function isCommerceError(error: unknown): error is CommerceError {
  return error instanceof CommerceError
}

export type CommerceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CommerceError }

export function commerceOk<T>(data: T): CommerceResult<T> {
  return { ok: true, data }
}

export function commerceFail<T>(error: CommerceError): CommerceResult<T> {
  return { ok: false, error }
}