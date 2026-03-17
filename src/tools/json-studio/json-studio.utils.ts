import { jsonrepair } from 'jsonrepair'

export interface JsonResult {
  output: string
  error: string | null
}

export interface JsonError {
  message: string
  line?: number
  col?: number
}

export function validateJson(input: string): JsonError | null {
  if (!input.trim()) return null
  try {
    JSON.parse(input)
    return null
  } catch (e) {
    const msg = (e as SyntaxError).message
    // Try to extract line/col from message like "at line X column Y"
    const lineMatch = msg.match(/line (\d+)/i)
    const colMatch = msg.match(/column (\d+)/i)
    return {
      message: msg,
      line: lineMatch ? parseInt(lineMatch[1]) : undefined,
      col: colMatch ? parseInt(colMatch[1]) : undefined,
    }
  }
}

export function formatJson(input: string, indent: 2 | 4 = 2): JsonResult {
  if (!input.trim()) return { output: '', error: null }
  try {
    const parsed = JSON.parse(input)
    return { output: JSON.stringify(parsed, null, indent), error: null }
  } catch (e) {
    return { output: '', error: (e as SyntaxError).message }
  }
}

export function fixJson(input: string, indent: 2 | 4 = 2): JsonResult {
  if (!input.trim()) return { output: '', error: null }
  try {
    const repaired = jsonrepair(input)
    const parsed = JSON.parse(repaired)
    return { output: JSON.stringify(parsed, null, indent), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function minifyJson(input: string): JsonResult {
  if (!input.trim()) return { output: '', error: null }
  try {
    const parsed = JSON.parse(input)
    return { output: JSON.stringify(parsed), error: null }
  } catch {
    // Try to fix first, then minify
    try {
      const repaired = jsonrepair(input)
      const parsed = JSON.parse(repaired)
      return { output: JSON.stringify(parsed), error: null }
    } catch (e2) {
      return { output: '', error: (e2 as Error).message }
    }
  }
}
