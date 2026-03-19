import { describe, it, expect } from 'vitest'
import { detectLanguage } from '../tools/comparator/comparator.utils'

describe('detectLanguage', () => {
  it('detects JSON', () => {
    expect(detectLanguage('{"name":"Alice","age":30}')).toBe('json')
    expect(detectLanguage('[1, 2, 3]')).toBe('json')
  })

  it('returns plaintext for empty input', () => {
    expect(detectLanguage('')).toBe('plaintext')
    expect(detectLanguage('   ')).toBe('plaintext')
  })

  it('detects HTML', () => {
    expect(detectLanguage('<!DOCTYPE html><html><body>hi</body></html>')).toBe('html')
    expect(detectLanguage('<html lang="en"><head></head><body></body></html>')).toBe('html')
  })

  it('detects SQL', () => {
    expect(detectLanguage('SELECT * FROM users WHERE id = 1')).toBe('sql')
    expect(detectLanguage('INSERT INTO users (name) VALUES ("Alice")')).toBe('sql')
  })

  it('detects TypeScript', () => {
    expect(detectLanguage('interface User { name: string; age: number; }')).toBe('typescript')
    expect(detectLanguage('type Result = string | null')).toBe('typescript')
  })

  it('detects JavaScript', () => {
    expect(detectLanguage('const x = 1\nfunction foo() { return x }')).toBe('javascript')
    expect(detectLanguage('const fn = () => { return 42 }')).toBe('javascript')
  })

  it('detects Python', () => {
    expect(detectLanguage('def greet(name):\n    print(f"Hello {name}")')).toBe('python')
    expect(detectLanguage('import os\nfrom pathlib import Path')).toBe('python')
  })

  it('detects Shell scripts', () => {
    expect(detectLanguage('#!/usr/bin/bash\necho "hello"')).toBe('shell')
    expect(detectLanguage('#!/bin/sh\nls -la')).toBe('shell')
  })

  it('detects CSS', () => {
    expect(detectLanguage('.container { display: flex; padding: 16px; }')).toBe('css')
  })

  it('detects Markdown', () => {
    expect(detectLanguage('# Heading\n\nSome paragraph text')).toBe('markdown')
    expect(detectLanguage('Check out [this link](https://example.com)')).toBe('markdown')
  })

  it('does NOT misidentify plain text as code', () => {
    expect(detectLanguage('The quick brown fox jumps over the lazy dog.')).toBe('plaintext')
  })

  it('does NOT misidentify YAML as JavaScript (colon false positive)', () => {
    // Plain text with colons should not be YAML unless multiple key: value patterns
    const result = detectLanguage('Time: 5pm\nPlace: here')
    expect(result).toBe('yaml')
  })
})
