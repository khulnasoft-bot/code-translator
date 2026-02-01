// Enhanced rule-based code transformer with mixed language detection, normalization, and comprehensive coverage
// Supports: Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#, PHP, Ruby

export const SUPPORTED_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'java',
  'cpp',
  'go',
  'rust',
  'csharp',
  'php',
  'ruby',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Enhanced line transformation tracking
export interface LineTransformation {
  original: string
  transformed: string
  warnings: string[]
  lineNumber: number
  changeType: 'added' | 'removed' | 'changed' | 'warning' | 'unchanged'
}

// AST Node for code structure
export interface ASTNode {
  type:
    | 'function'
    | 'class'
    | 'if'
    | 'for'
    | 'while'
    | 'import'
    | 'variable'
    | 'statement'
    | 'block'
    | 'comment'
  name?: string
  content: string
  lineStart: number
  lineEnd: number
  children: ASTNode[]
  language?: string
}

// Comprehensive transformation result
export interface TransformationResult {
  code: string
  lines: LineTransformation[]
  warnings: string[]
  errors: string[]
  statistics: {
    functionsDetected: number
    classesDetected: number
    importsDetected: number
    linesTransformed: number
    mixedLanguageDetected: boolean
    normalizationApplied: boolean
  }
  ast: ASTNode[]
}

// Rules for pattern matching and transformation
interface TransformationRule {
  pattern: RegExp
  replacer: (match: string, ...groups: string[]) => string
  warning?: string
  condition?: (line: string, lang: string) => boolean
}

// Central rule management system
class RuleEngine {
  private rules: Map<string, TransformationRule[]> = new Map()

  constructor() {
    this.initializeRules()
  }

  private initializeRules() {
    // Function transformation rules
    this.addRule('functions', {
      pattern: /^(\s*)def\s+(\w+)\s*\((.*?)\)\s*(?:->.*)?:/,
      replacer: (match, indent, name, params) => `${indent}function ${name}(${params}) {`,
    })

    // Class transformation rules
    this.addRule('classes', {
      pattern: /^(\s*)class\s+(\w+)(?:\((.*?)\))?\s*:/,
      replacer: (match, indent, name, base) => `${indent}class ${name} {`,
    })

    // Import transformation rules
    this.addRule('imports', {
      pattern: /^(\s*)(?:from\s+(\S+)\s+)?import\s+([\w\s,.*]+)/,
      replacer: (match, indent, module, names) => `${indent}import ${names} from '${module || 'module'}';`,
    })

    // Print/Log transformation rules
    this.addRule('print', {
      pattern: /\bprint\s*\((.*?)\)/,
      replacer: (match, args) => `console.log(${args})`,
    })

    // Variable declaration
    this.addRule('variables', {
      pattern: /^(\s*)(\w+)\s*=\s*(.+)$/,
      replacer: (match, indent, name, value) => `${indent}const ${name} = ${value};`,
    })

    // Boolean constants
    this.addRule('booleans', {
      pattern: /\b(True|False|None)\b/g,
      replacer: (match) => {
        const map: Record<string, string> = { True: 'true', False: 'false', None: 'null' }
        return map[match] || match
      },
    })

    // Loop transformations
    this.addRule('loops', {
      pattern: /^(\s*)for\s+(\w+)\s+in\s+(\w+)\s*:/,
      replacer: (match, indent, var_, iter) => `${indent}for (let ${var_} of ${iter}) {`,
    })

    // Conditional transformations
    this.addRule('conditionals', {
      pattern: /^(\s*)if\s+\(?(.*?)\)?\s*:?$/,
      replacer: (match, indent, condition) => {
        const cleanCond = condition.replace(/:\s*$/, '').trim()
        return `${indent}if (${cleanCond}) {`
      },
    })
  }

  addRule(category: string, rule: TransformationRule) {
    if (!this.rules.has(category)) {
      this.rules.set(category, [])
    }
    this.rules.get(category)!.push(rule)
  }

  getRules(category: string): TransformationRule[] {
    return this.rules.get(category) || []
  }

  getAllRules(): TransformationRule[] {
    return Array.from(this.rules.values()).flat()
  }
}

const ruleEngine = new RuleEngine()

/**
 * Detect mixed/hybrid language usage in code
 */
export function detectMixedLanguages(code: string): {
  detected: boolean
  languages: string[]
  confidence: number
} {
  const indicators: Record<string, number> = {}

  const pythonPatterns = [/^def\s+/, /^import\s+/, /^\s+[a-z]/, /print\(/, /:\s*$/m]
  const jsPatterns = [/function\s+/, /const\s+/, /let\s+/, /console\.log/, /{\s*$/m]
  const javaPatterns = [/public\s+class/, /public\s+static/, /;$/m]

  pythonPatterns.forEach((p) => {
    indicators['python'] = (indicators['python'] || 0) + (code.match(p) ? 1 : 0)
  })

  jsPatterns.forEach((p) => {
    indicators['javascript'] = (indicators['javascript'] || 0) + (code.match(p) ? 1 : 0)
  })

  javaPatterns.forEach((p) => {
    indicators['java'] = (indicators['java'] || 0) + (code.match(p) ? 1 : 0)
  })

  const detected = Object.values(indicators).filter((v) => v > 0).length > 1
  const languages = Object.entries(indicators)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([lang]) => lang)

  return {
    detected,
    languages,
    confidence: detected ? 0.7 : 1.0,
  }
}

/**
 * Pre-process code to prepare for transformation
 */
function preprocessCode(code: string): { processed: string; warnings: string[] } {
  const warnings: string[] = []
  let processed = code

  // Normalize line endings
  processed = processed.replace(/\r\n/g, '\n')

  // Remove trailing whitespace on each line
  processed = processed
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')

  // Fix common spacing issues
  processed = processed.replace(/(\w)\s+{/g, '$1 {')
  processed = processed.replace(/,\s+/g, ', ')
  processed = processed.replace(/\s+;/g, ';')

  return { processed, warnings }
}

/**
 * Normalize mixed language code before transformation
 */
export function normalizeCode(code: string): { normalized: string; warnings: string[] } {
  const warnings: string[] = []
  let normalized = code

  // Pre-process first
  const { processed: preprocessed, warnings: prepWarnings } = preprocessCode(code)
  normalized = preprocessed
  warnings.push(...prepWarnings)

  // Detect mixed languages
  const mixed = detectMixedLanguages(normalized)
  if (mixed.detected) {
    warnings.push(`Mixed languages detected: ${mixed.languages.join(', ')}. Normalizing code...`)
  }

  // Auto-correct elif → else if
  normalized = normalized.replace(/^\s*elif\s+/gm, 'else if ')

  // Auto-correct missing colons (Python-style) - for control structures
  normalized = normalized.replace(/^(\s*(?:if|elif|else|for|while|def|class|try|except|finally|with).+?)(\n)/gm, (match, content, newline) => {
    if (!content.trim().endsWith(':') && !content.trim().endsWith('{') && !content.trim().endsWith('else')) {
      return content + ':' + newline
    }
    return match
  })

  // Auto-correct missing braces (JS/Java-style) - for control structures and functions
  normalized = normalized.replace(/^(\s*(?:function|if|else|for|while|class|try|catch|finally).+?)(\n(?!\s*{))/gm, (match, content, newline) => {
    if (!content.trim().endsWith('{') && !content.trim().endsWith('else')) {
      return content + ' {' + newline
    }
    return match
  })

  // Fix inconsistent quote usage (normalize to double quotes)
  const lines = normalized.split('\n')
  normalized = lines
    .map((line) => {
      // Don't touch comments
      if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*')) {
        return line
      }
      // Convert single quotes to double quotes (simple approach)
      return line.replace(/(?<!\\)'/g, '"')
    })
    .join('\n')

  // Remove duplicate semicolons
  normalized = normalized.replace(/;;+/g, ';')

  // Fix mismatched operators: || and && in Python (and/or)
  normalized = normalized.replace(/\|\|/g, 'or')
  normalized = normalized.replace(/&&/g, 'and')

  // Convert print() to appropriate format if needed
  // This will be handled per-language in the transformation

  return { normalized, warnings }
}

/**
 * Detect language with improved accuracy
 */
export function detectLanguage(code: string): SupportedLanguage {
  code = code.toLowerCase()
  const lines = code.split('\n')
  const scores: Record<string, number> = {}

  // Python scoring
  if (code.includes('def ')) scores['python'] = (scores['python'] || 0) + 3
  if (code.includes('import ') || code.includes('from ')) scores['python'] = (scores['python'] || 0) + 2
  if (code.includes('print(')) scores['python'] = (scores['python'] || 0) + 2
  if (lines.some((l) => /^\s{2,}[a-z]/.test(l))) scores['python'] = (scores['python'] || 0) + 1

  // JavaScript scoring
  if (code.includes('function ') || code.includes('const ') || code.includes('let ')) scores['javascript'] = (scores['javascript'] || 0) + 3
  if (code.includes('console.log')) scores['javascript'] = (scores['javascript'] || 0) + 2

  // TypeScript scoring
  if (code.includes(': string') || code.includes(': number') || code.includes('interface ')) scores['typescript'] = (scores['typescript'] || 0) + 3

  // Java scoring
  if (code.includes('public class') || code.includes('public static')) scores['java'] = (scores['java'] || 0) + 3

  // C++ scoring
  if (code.includes('#include') || code.includes('std::')) scores['cpp'] = (scores['cpp'] || 0) + 3

  // Go scoring
  if (code.includes('package ') && code.includes('func ')) scores['go'] = (scores['go'] || 0) + 3

  // Rust scoring
  if (code.includes('fn ') && code.includes('let ')) scores['rust'] = (scores['rust'] || 0) + 3

  // C# scoring
  if (code.includes('using ') && code.includes('namespace ')) scores['csharp'] = (scores['csharp'] || 0) + 3

  // PHP scoring
  if (code.includes('<?php') || code.includes('$')) scores['php'] = (scores['php'] || 0) + 3

  // Ruby scoring
  if (code.includes('def ') && code.includes('end')) scores['ruby'] = (scores['ruby'] || 0) + 2

  const detected = Object.entries(scores).sort(([, a], [, b]) => b - a)[0]?.[0] as SupportedLanguage

  return detected || 'javascript'
}

/**
 * Transform a single line with full context
 */
function transformLine(
  line: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage,
  warnings: string[],
  lineNumber: number
): LineTransformation {
  const indent = line.match(/^\s*/)?.[0] || ''
  const content = line.trim()

  // Skip empty lines and comments
  if (!content || content.startsWith('//') || content.startsWith('#') || content.startsWith('/*')) {
    return {
      original: line,
      transformed: line,
      warnings: [],
      lineNumber,
      changeType: 'unchanged',
    }
  }

  let transformed = line
  const lineWarnings: string[] = []

  // Apply transformation sequence
  const transformations = [
    () => transformFunctionDef(transformed, sourceLang, targetLang, lineWarnings),
    () => transformClassDef(transformed, sourceLang, targetLang, lineWarnings),
    () => transformImportStatement(transformed, sourceLang, targetLang, lineWarnings),
    () => transformPrintStatement(transformed, sourceLang, targetLang, lineWarnings),
    () => transformConditionals(transformed, sourceLang, targetLang, lineWarnings),
    () => transformLoops(transformed, sourceLang, targetLang, lineWarnings),
    () => transformVariableDeclaration(transformed, sourceLang, targetLang, lineWarnings),
    () => transformBooleanConstants(transformed, sourceLang, targetLang, lineWarnings),
    () => transformOperators(transformed, sourceLang, targetLang, lineWarnings),
    () => transformStatementEndings(transformed, sourceLang, targetLang, lineWarnings),
  ]

  for (const transform of transformations) {
    transformed = transform()
  }

  warnings.push(...lineWarnings)

  const changed = transformed !== line
  return {
    original: line,
    transformed,
    warnings: lineWarnings,
    lineNumber,
    changeType: lineWarnings.length > 0 ? 'warning' : changed ? 'changed' : 'unchanged',
  }
}

// Language-specific transformation functions
function transformFunctionDef(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  if (source === 'python') {
    return line.replace(/^(\s*)def\s+(\w+)\s*\((.*?)\)\s*(?:->.*)?:/, (match, indent, name, params) => {
      switch (target) {
        case 'javascript':
        case 'typescript':
          return `${indent}function ${name}(${params}) {`
        case 'java':
          return `${indent}public static Object ${name}(${params}) {`
        case 'cpp':
          return `${indent}void ${name}(${params}) {`
        case 'csharp':
          return `${indent}public static object ${name}(${params}) {`
        case 'go':
          return `${indent}func ${name}(${params}) {`
        case 'rust':
          return `${indent}fn ${name}(${params}) {`
        case 'php':
          return `${indent}function ${name}(${params}) {`
        case 'ruby':
          return `${indent}def ${name}(${params})`
        default:
          return line
      }
    })
  }

  if (source === 'javascript' || source === 'typescript') {
    return line.replace(/^(\s*)(?:async\s+)?function\s+(\w+)\s*\((.*?)\)\s*{/, (match, indent, name, params) => {
      switch (target) {
        case 'python':
          return `${indent}def ${name}(${params}):`
        case 'java':
          return `${indent}public static Object ${name}(${params}) {`
        case 'cpp':
          return `${indent}void ${name}(${params}) {`
        case 'csharp':
          return `${indent}public static object ${name}(${params}) {`
        case 'go':
          return `${indent}func ${name}(${params}) {`
        case 'rust':
          return `${indent}fn ${name}(${params}) {`
        case 'php':
          return `${indent}function ${name}(${params}) {`
        case 'ruby':
          return `${indent}def ${name}(${params})`
        default:
          return line
      }
    })
  }

  return line
}

function transformClassDef(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  if (source === 'python') {
    return line.replace(/^(\s*)class\s+(\w+)(?:\((.*?)\))?\s*:/, (match, indent, name, base) => {
      switch (target) {
        case 'javascript':
        case 'typescript':
          return `${indent}class ${name} {`
        case 'java':
          return `${indent}public class ${name} {`
        case 'cpp':
          return `${indent}class ${name} {`
        case 'csharp':
          return `${indent}public class ${name} {`
        case 'go':
          warnings.push('Go does not have classes. Converting to struct.')
          return `${indent}type ${name} struct {`
        case 'rust':
          return `${indent}struct ${name} {`
        case 'php':
          return `${indent}class ${name} {`
        case 'ruby':
          return `${indent}class ${name}`
        default:
          return line
      }
    })
  }

  return line
}

function transformImportStatement(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // Python imports
  if (source === 'python') {
    if (line.includes('import ')) {
      return line.replace(/^(\s*)(?:from\s+(\S+)\s+)?import\s+([\w\s,.*]+)/, (match, indent, module, names) => {
        switch (target) {
          case 'javascript':
          case 'typescript':
            return `${indent}import ${names} from '${module || 'module'}';`
          case 'java':
            return `${indent}import ${module}.*;`
          case 'cpp':
            return `${indent}#include "${module || 'module.h'}"`
          case 'go':
            return `${indent}import "${module || 'package'}"`
          case 'csharp':
            return `${indent}using ${module || 'Namespace'};`
          case 'php':
            return `${indent}require('${module || 'module'}');`
          case 'ruby':
            return `${indent}require '${module || 'module'}'`
          default:
            return line
        }
      })
    }
  }

  return line
}

function transformPrintStatement(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // Python print
  if (source === 'python' && line.includes('print')) {
    return line.replace(/\bprint\s*\((.*?)\)(?=;|$)/g, (match, args) => {
      switch (target) {
        case 'javascript':
        case 'typescript':
          return `console.log(${args})`
        case 'java':
          return `System.out.println(${args})`
        case 'cpp':
          return `std::cout << ${args} << std::endl;`
        case 'go':
          return `fmt.Println(${args})`
        case 'csharp':
          return `Console.WriteLine(${args});`
        case 'php':
          return `echo ${args};`
        case 'ruby':
          return `puts ${args}`
        default:
          return match
      }
    })
  }

  // JavaScript/TypeScript console.log to other languages
  if ((source === 'javascript' || source === 'typescript') && line.includes('console.log')) {
    return line.replace(/\bconsole\.log\s*\((.*?)\)(?=;|$)/g, (match, args) => {
      switch (target) {
        case 'python':
          return `print(${args})`
        case 'java':
          return `System.out.println(${args})`
        case 'cpp':
          return `std::cout << ${args} << std::endl;`
        case 'go':
          return `fmt.Println(${args})`
        case 'csharp':
          return `Console.WriteLine(${args});`
        case 'php':
          return `echo ${args};`
        case 'ruby':
          return `puts ${args}`
        default:
          return match
      }
    })
  }

  // Java System.out.println to other languages
  if (source === 'java' && line.includes('System.out.println')) {
    return line.replace(/System\.out\.println\s*\((.*?)\)(?=;|$)/g, (match, args) => {
      switch (target) {
        case 'python':
          return `print(${args})`
        case 'javascript':
        case 'typescript':
          return `console.log(${args})`
        case 'cpp':
          return `std::cout << ${args} << std::endl;`
        case 'go':
          return `fmt.Println(${args})`
        case 'csharp':
          return `Console.WriteLine(${args});`
        case 'php':
          return `echo ${args};`
        case 'ruby':
          return `puts ${args}`
        default:
          return match
      }
    })
  }

  return line
}

function transformConditionals(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  return line.replace(/^(\s*)if\s+\(?(.*?)\)?\s*:?$/, (match, indent, condition) => {
    const cleanCond = condition.replace(/:\s*$/, '').trim()

    switch (target) {
      case 'python':
        return `${indent}if ${cleanCond}:`
      case 'javascript':
      case 'typescript':
        return `${indent}if (${cleanCond}) {`
      case 'java':
        return `${indent}if (${cleanCond}) {`
      case 'cpp':
        return `${indent}if (${cleanCond}) {`
      case 'go':
        return `${indent}if ${cleanCond} {`
      case 'csharp':
        return `${indent}if (${cleanCond}) {`
      default:
        return match
    }
  })
}

function transformLoops(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // For loops
  if (source === 'python') {
    return line.replace(/^(\s*)for\s+(\w+)\s+in\s+([\w.]+)\s*:/, (match, indent, var_, iter) => {
      switch (target) {
        case 'javascript':
        case 'typescript':
          return `${indent}for (let ${var_} of ${iter}) {`
        case 'java':
          return `${indent}for (var ${var_} : ${iter}) {`
        case 'cpp':
          return `${indent}for (auto ${var_} : ${iter}) {`
        case 'go':
          return `${indent}for ${var_} := range ${iter} {`
        default:
          return match
      }
    })
  }

  return line
}

function transformVariableDeclaration(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // Simple assignment pattern
  return line.replace(/^(\s*)(\w+)\s*=\s*(.+)$/, (match, indent, name, value) => {
    if (target === 'python') {
      return `${indent}${name} = ${value}`
    } else if (['javascript', 'typescript', 'java', 'cpp', 'csharp', 'go', 'rust', 'php'].includes(target)) {
      return `${indent}${target === 'python' ? '' : 'const '}${name} = ${value}${target === 'javascript' || target === 'typescript' || target === 'java' || target === 'csharp' ? ';' : ''}`
    }
    return match
  })
}

function transformBooleanConstants(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  if (source === 'python') {
    return line.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null')
  }
  return line
}

function transformOperators(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // Python 'and' -> &&
  if (source === 'python' && target !== 'python') {
    return line.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!')
  }
  return line
}

function transformStatementEndings(
  line: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  warnings: string[]
): string {
  // Add semicolons for languages that require them
  const needsSemicolon = ['javascript', 'typescript', 'java', 'cpp', 'csharp'].includes(target)
  const pythonStyle = source === 'python'

  if (needsSemicolon && pythonStyle && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith(':')) {
    if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
      return line.trimEnd() + ';'
    }
  }

  return line
}

/**
 * Calculate line-by-line changes for diff visualization
 */
export function calculateLineChanges(sourceCode: string, translatedCode: string) {
  const sourceLines = sourceCode.split('\n')
  const translatedLines = translatedCode.split('\n')

  return sourceLines.map((source, i) => ({
    type:
      !source && translatedLines[i]
        ? 'added'
        : source && !translatedLines[i]
          ? 'removed'
          : source === translatedLines[i]
            ? 'unchanged'
            : 'changed',
    source,
    translated: translatedLines[i] || '',
  }))
}

/**
 * Build AST from code
 */
export function buildAST(code: string, language: SupportedLanguage): ASTNode[] {
  const lines = code.split('\n')
  const nodes: ASTNode[] = []
  const stack: ASTNode[] = []

  lines.forEach((line, idx) => {
    const indent = line.match(/^\s*/)?.[0]?.length || 0
    const content = line.trim()

    if (!content) return

    // Determine node type
    let type: ASTNode['type'] = 'statement'
    if (content.startsWith('function') || content.startsWith('def') || content.startsWith('fn'))
      type = 'function'
    else if (content.startsWith('class')) type = 'class'
    else if (content.startsWith('if')) type = 'if'
    else if (content.startsWith('for') || content.startsWith('while')) type = 'for'
    else if (content.startsWith('import')) type = 'import'
    else if (content.startsWith('//') || content.startsWith('#')) type = 'comment'

    const node: ASTNode = {
      type,
      content,
      lineStart: idx,
      lineEnd: idx,
      children: [],
      language,
    }

    // Handle nesting based on indent
    while (stack.length > 0 && stack[stack.length - 1].lineEnd < idx - 1) {
      stack.pop()
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node)
    } else {
      nodes.push(node)
    }

    if (
      type === 'function' ||
      type === 'class' ||
      type === 'if' ||
      (type === 'for' && (content.endsWith('{') || content.endsWith(':')))
    ) {
      stack.push(node)
    }
  })

  return nodes
}

/**
 * Post-process code for language-specific cleanup and validation
 */
function postProcessCode(code: string, targetLang: SupportedLanguage): string {
  let processed = code

  // Language-specific post-processing
  if (['javascript', 'typescript', 'java', 'cpp', 'csharp', 'go', 'rust'].includes(targetLang)) {
    // Fix unmatched braces
    const openBraces = (processed.match(/{/g) || []).length
    const closeBraces = (processed.match(/}/g) || []).length

    if (openBraces > closeBraces) {
      const missingCount = openBraces - closeBraces
      processed += '\n' + '}'.repeat(missingCount)
    } else if (closeBraces > openBraces) {
      // Remove extra closing braces
      const lines = processed.split('\n')
      let removed = 0
      for (let i = lines.length - 1; i >= 0 && removed < closeBraces - openBraces; i--) {
        if (lines[i].trim() === '}') {
          lines.splice(i, 1)
          removed++
        }
      }
      processed = lines.join('\n')
    }

    // Ensure proper spacing around braces
    processed = processed.replace(/\n\s*{/g, ' {')
  }

  // Python-specific post-processing
  if (targetLang === 'python') {
    // Remove unnecessary semicolons
    processed = processed.replace(/;$/gm, '')
    // Ensure proper indentation
    const lines = processed.split('\n')
    processed = lines
      .map((line) => {
        if (line.trim().endsWith(':') || line.trim().endsWith('{')) {
          return line
        }
        return line
      })
      .join('\n')
  }

  // Ruby-specific post-processing
  if (targetLang === 'ruby') {
    // Remove unnecessary braces and semicolons
    processed = processed.replace(/{/g, '').replace(/}/g, '').replace(/;$/gm, '')
  }

  // Go-specific post-processing
  if (targetLang === 'go') {
    // Ensure package declaration is first (if not present, add placeholder)
    if (!processed.includes('package ')) {
      processed = 'package main\n\n' + processed
    }
  }

  // Fix indentation consistency
  const lines = processed.split('\n')
  let inBlock = 0
  processed = lines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''

      // Decrease indent for closing braces
      if (trimmed.startsWith('}') || trimmed.startsWith('end')) {
        inBlock = Math.max(0, inBlock - 1)
      }

      // Get indent
      const indent = '  '.repeat(inBlock)
      let result = indent + trimmed

      // Increase indent for opening braces
      if (trimmed.endsWith('{') || trimmed.endsWith(':') || trimmed === 'do') {
        inBlock++
      }

      return result
    })
    .join('\n')

  return processed
}

/**
 * Main transformation function with full enhancements
 */
export function transformCode(
  code: string,
  sourceLang: string,
  targetLang: string
): TransformationResult {
  const source = (sourceLang.toLowerCase() as SupportedLanguage) || 'javascript'
  const target = (targetLang.toLowerCase() as SupportedLanguage) || 'javascript'

  if (source === target) {
    const lines = code.split('\n')
    return {
      code,
      lines: lines.map((line, idx) => ({
        original: line,
        transformed: line,
        warnings: [],
        lineNumber: idx,
        changeType: 'unchanged',
      })),
      warnings: [],
      errors: [],
      statistics: {
        functionsDetected: 0,
        classesDetected: 0,
        importsDetected: 0,
        linesTransformed: 0,
        mixedLanguageDetected: false,
        normalizationApplied: false,
      },
      ast: buildAST(code, source),
    }
  }

  // Step 1: Detect mixed languages
  const mixedDetection = detectMixedLanguages(code)

  // Step 2: Normalize code
  const { normalized, warnings: normWarnings } = normalizeCode(code)
  const normalizationApplied = mixedDetection.detected || normWarnings.length > 0

  // Step 3: Transform lines
  const lines = normalized.split('\n')
  const transformedLines: LineTransformation[] = []
  const allWarnings: Set<string> = new Set()
  normWarnings.forEach((w) => allWarnings.add(w))

  let statsFunc = 0
  let statsClass = 0
  let statsImport = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const result = transformLine(line, source, target, [], i)
    transformedLines.push(result)

    // Track statistics
    if (line.includes('def ') || line.includes('function ')) statsFunc++
    if (line.includes('class ')) statsClass++
    if (line.includes('import ')) statsImport++

    result.warnings.forEach((w) => allWarnings.add(w))
  }

  // Step 4: Build final code
  const finalCode = transformedLines.map((l) => l.transformed).join('\n')
  const cleanedCode = postProcessCode(finalCode, target)

  // Step 5: Build AST
  const ast = buildAST(cleanedCode, target)

  return {
    code: cleanedCode,
    lines: transformedLines,
    warnings: Array.from(allWarnings),
    errors: [],
    statistics: {
      functionsDetected: statsFunc,
      classesDetected: statsClass,
      importsDetected: statsImport,
      linesTransformed: transformedLines.filter((l) => l.changeType !== 'unchanged').length,
      mixedLanguageDetected: mixedDetection.detected,
      normalizationApplied,
    },
    ast,
  }
}

// Export utility functions for diff and AST visualization
