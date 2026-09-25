import { describe, it, expect } from 'vitest'
import { decodeJwt, formatRelative, getExpStatus } from '../tools/jwt-decoder/jwt.utils'

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('returns null for empty input', () => {
    expect(decodeJwt('')).toBeNull()
  })

  it('decodes header, payload and signature', () => {
    const result = decodeJwt(SAMPLE)
    expect(result).toMatchObject({
      ok: true,
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '1234567890', name: 'John Doe', exp: 9999999999 },
      signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  })

  it('decodes UTF-8 payloads', () => {
    const payload = Buffer.from(JSON.stringify({ name: 'שלום' })).toString('base64url')
    const result = decodeJwt(`eyJhbGciOiJub25lIn0.${payload}.`)
    expect(result).toMatchObject({ ok: true, payload: { name: 'שלום' } })
  })

  it('rejects tokens without 3 parts', () => {
    expect(decodeJwt('a.b')).toEqual({ ok: false, error: 'Expected 3 dot-separated parts, got 2' })
  })

  it('rejects malformed segments', () => {
    expect(decodeJwt('not.valid.jwt')).toMatchObject({ ok: false })
  })
})

describe('getExpStatus', () => {
  it('flags expired tokens', () => expect(getExpStatus(-1)).toBe('expired'))
  it('flags tokens expiring within 5 minutes', () => {
    expect(getExpStatus(0)).toBe('expiring')
    expect(getExpStatus(299)).toBe('expiring')
  })
  it('flags valid tokens', () => expect(getExpStatus(300)).toBe('valid'))
})

describe('formatRelative', () => {
  it('formats seconds, minutes, hours and days', () => {
    expect(formatRelative(-45)).toBe('45s')
    expect(formatRelative(120)).toBe('2m')
    expect(formatRelative(7200)).toBe('2h')
    expect(formatRelative(172800)).toBe('2d')
  })
})
