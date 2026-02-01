// Comprehensive syntax highlighting for multiple languages
const colorMap: Record<string, string> = {
  keyword: 'text-blue-400',
  string: 'text-green-400',
  number: 'text-cyan-400',
  comment: 'text-gray-500',
  function: 'text-yellow-400',
  class: 'text-purple-400',
  operator: 'text-pink-400',
  boolean: 'text-orange-400',
  builtin: 'text-indigo-400',
}

interface Token {
  type: string
  value: string
  class: string
}

const languagePatterns: Record<string, { keywords: string[]; patterns: Record<string, RegExp> }> = {
  python: {
    keywords: [
      'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue',
      'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda', 'yield',
      'pass', 'raise', 'assert', 'del', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False',
    ],
    patterns: {
      comment: /#.*$/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*\b/g,
      function: /\b([a-zA-Z_]\w*)\s*(?=\()/g,
      class: /\bclass\s+([a-zA-Z_]\w*)/g,
    },
  },
  javascript: {
    keywords: [
      'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do',
      'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw',
      'async', 'await', 'class', 'extends', 'super', 'this', 'new', 'delete',
      'import', 'export', 'default', 'from', 'as', 'static', 'get', 'set',
      'true', 'false', 'null', 'undefined', 'void', 'typeof', 'instanceof',
    ],
    patterns: {
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*\b/g,
      function: /\b([a-zA-Z_$]\w*)\s*(?=\()/g,
      class: /\bclass\s+([a-zA-Z_$]\w*)/g,
    },
  },
  java: {
    keywords: [
      'public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface',
      'extends', 'implements', 'new', 'this', 'super', 'void', 'int', 'double', 'float',
      'long', 'short', 'byte', 'char', 'boolean', 'String', 'true', 'false', 'null',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'synchronized',
    ],
    patterns: {
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*[fLdD]?\b/g,
      function: /\b([a-zA-Z_]\w*)\s*(?=\()/g,
      class: /\bclass\s+([a-zA-Z_]\w*)/g,
    },
  },
  cpp: {
    keywords: [
      'int', 'void', 'char', 'double', 'float', 'bool', 'long', 'short', 'unsigned', 'signed',
      'const', 'static', 'volatile', 'extern', 'auto', 'register', 'class', 'struct', 'union',
      'namespace', 'using', 'template', 'typename', 'public', 'private', 'protected', 'virtual',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'try', 'catch', 'throw', 'new', 'delete', 'this', 'true', 'false', 'nullptr',
    ],
    patterns: {
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*[fFlL]?\b/g,
      function: /\b([a-zA-Z_]\w*)\s*(?=\()/g,
      class: /\b(class|struct)\s+([a-zA-Z_]\w*)/g,
    },
  },
  go: {
    keywords: [
      'func', 'package', 'import', 'const', 'var', 'type', 'struct', 'interface',
      'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue',
      'return', 'defer', 'go', 'select', 'chan', 'map', 'slice', 'array',
      'int', 'string', 'bool', 'float64', 'error', 'true', 'false', 'nil',
      'make', 'len', 'cap', 'append', 'copy', 'close', 'delete',
    ],
    patterns: {
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*\b/g,
      function: /\bfunc\s+\(?\w+\)?\s*([a-zA-Z_]\w*)/g,
    },
  },
  rust: {
    keywords: [
      'fn', 'let', 'const', 'static', 'mut', 'unsafe', 'async', 'await', 'move',
      'pub', 'crate', 'mod', 'use', 'type', 'trait', 'impl', 'struct', 'enum',
      'if', 'else', 'match', 'for', 'while', 'loop', 'break', 'continue', 'return',
      'true', 'false', 'as', 'where', 'dyn', 'ref', 'in', 'self', 'super',
    ],
    patterns: {
      comment: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*\b/g,
      function: /\bfn\s+([a-zA-Z_]\w*)/g,
      macro: /\b([a-zA-Z_]\w*!)(?=\()/g,
    },
  },
  r: {
    keywords: [
      'function', 'if', 'else', 'for', 'in', 'while', 'repeat', 'break', 'next', 'return',
      'TRUE', 'FALSE', 'NULL', 'NA', 'Inf', 'NaN', 'library', 'require', 'source',
      'data.frame', 'list', 'vector', 'matrix', 'array', 'factor', 'class', 'c',
    ],
    patterns: {
      comment: /#.*$/gm,
      string: /(['"`])(?:(?=(\\?))\2.)*?\1/g,
      number: /\b\d+\.?\d*\b/g,
      function: /\b([a-zA-Z_.]\w*)\s*(?=\()/g,
    },
  },
}

export function highlightCode(code: string, language: string): Array<{ text: string; class: string }> {
  const patterns = languagePatterns[language]
  if (!patterns) {
    // Fallback: return code as-is without highlighting
    return [{ text: code, class: 'text-foreground' }]
  }

  const tokens: Token[] = []
  let lastIndex = 0
  const lines = code.split('\n')

  // Track all matches with their positions
  const matches: Array<{ index: number; length: number; type: string }> = []

  // Keywords
  patterns.keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g')
    let match
    while ((match = regex.exec(code)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type: 'keyword' })
    }
  })

  // Pattern matches
  Object.entries(patterns.patterns).forEach(([type, pattern]) => {
    let match
    const globalPattern = new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'))
    while ((match = globalPattern.exec(code)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type })
    }
  })

  // Sort matches by index and remove overlaps
  matches.sort((a, b) => a.index - b.index)
  const filteredMatches: Array<{ index: number; length: number; type: string }> = []
  let lastEnd = 0
  matches.forEach((match) => {
    if (match.index >= lastEnd) {
      filteredMatches.push(match)
      lastEnd = match.index + match.length
    }
  })

  // Build result
  const result: Array<{ text: string; class: string }> = []
  let currentIndex = 0

  filteredMatches.forEach((match) => {
    if (currentIndex < match.index) {
      result.push({
        text: code.substring(currentIndex, match.index),
        class: 'text-foreground',
      })
    }

    result.push({
      text: code.substring(match.index, match.index + match.length),
      class: colorMap[match.type] || 'text-foreground',
    })

    currentIndex = match.index + match.length
  })

  if (currentIndex < code.length) {
    result.push({
      text: code.substring(currentIndex),
      class: 'text-foreground',
    })
  }

  return result
}
