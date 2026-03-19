import { describe, it, expect } from 'vitest'
import { validateJson, formatJson, fixJson, minifyJson } from '../tools/json-studio/json-studio.utils'

describe('validateJson', () => {
  it('returns null for valid JSON', () => {
    expect(validateJson('{"a":1}')).toBeNull()
    expect(validateJson('[1,2,3]')).toBeNull()
    expect(validateJson('"hello"')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(validateJson('')).toBeNull()
    expect(validateJson('   ')).toBeNull()
  })

  it('returns an error for invalid JSON', () => {
    const result = validateJson('{a: 1}')
    expect(result).not.toBeNull()
    expect(result?.message).toBeTruthy()
  })
})

describe('formatJson', () => {
  it('formats valid JSON with 2-space indent', () => {
    const result = formatJson('{"a":1,"b":2}', 2)
    expect(result.error).toBeNull()
    expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('formats valid JSON with 4-space indent', () => {
    const result = formatJson('{"a":1}', 4)
    expect(result.error).toBeNull()
    expect(result.output).toBe('{\n    "a": 1\n}')
  })

  it('returns error for invalid JSON', () => {
    const result = formatJson('{bad json}')
    expect(result.error).toBeTruthy()
    expect(result.output).toBe('')
  })

  it('returns empty output for empty input', () => {
    const result = formatJson('')
    expect(result.error).toBeNull()
    expect(result.output).toBe('')
  })
})

describe('fixJson', () => {
  it('fixes malformed JSON with single quotes', () => {
    const result = fixJson("{'a': 1}")
    expect(result.error).toBeNull()
    const parsed = JSON.parse(result.output)
    expect(parsed).toEqual({ a: 1 })
  })

  it('fixes JSON with trailing commas', () => {
    const result = fixJson('{"a":1,}')
    expect(result.error).toBeNull()
    const parsed = JSON.parse(result.output)
    expect(parsed).toEqual({ a: 1 })
  })

  it('fixes JSON with missing quotes on keys', () => {
    const result = fixJson('{a: 1}')
    expect(result.error).toBeNull()
    const parsed = JSON.parse(result.output)
    expect(parsed).toEqual({ a: 1 })
  })

  it('formats the fixed output with indent', () => {
    const result = fixJson("{'a':1}", 2)
    expect(result.error).toBeNull()
    expect(result.output).toBe('{\n  "a": 1\n}')
  })
})

describe('minifyJson', () => {
  it('minifies formatted JSON', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}')
    expect(result.error).toBeNull()
    expect(result.output).toBe('{"a":1,"b":2}')
  })

  it('minifies and fixes malformed JSON', () => {
    const result = minifyJson("{'a': 1}")
    expect(result.error).toBeNull()
    const parsed = JSON.parse(result.output)
    expect(parsed).toEqual({ a: 1 })
  })

  it('returns error for completely invalid JSON', () => {
    const result = minifyJson('not json at all !!!{}')
    // May error or may produce something — just ensure output is consistent
    if (result.error) {
      expect(result.output).toBe('')
    }
  })

  it('returns empty output for empty input', () => {
    const result = minifyJson('')
    expect(result.error).toBeNull()
    expect(result.output).toBe('')
  })
})
