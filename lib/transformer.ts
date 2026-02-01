// Comprehensive rule-based code transformer supporting 10 languages
// Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#, PHP, Ruby

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
]

interface LineTransformation {
  original: string
  transformed: string
  warnings: string[]
}

interface TransformationResult {
  code: string
  lines: LineTransformation[]
  warnings: string[]
}

// AST-like node for basic parsing
interface CodeNode {
  type: 'function' | 'class' | 'if' | 'for' | 'while' | 'import' | 'variable' | 'statement'
  name?: string
  content: string
  lineStart: number
  lineEnd: number
  children: CodeNode[]
}

/**
 * Detect the probable source language
 */
export function detectLanguage(code: string): string {
  code = code.toLowerCase()
  const lines = code.split('\n')

  // Python indicators
  if (
    code.includes('def ') ||
    code.includes('import ') ||
    code.includes('from ') ||
    lines.some((l) => /^[ ]{2,}[a-z]/.test(l))
  ) {
    return 'python'
  }

  // Go indicators
  if (code.includes('package ') && code.includes('func ')) {
    return 'go'
  }

  // Rust indicators
  if (code.includes('fn ') && code.includes('let ')) {
    return 'rust'
  }

  // C++ indicators
  if (code.includes('#include') || code.includes('std::')) {
    return 'cpp'
  }

  // Java indicators
  if (code.includes('public class') || code.includes('public static')) {
    return 'java'
  }

  // C# indicators
  if (code.includes('using ') && code.includes('namespace ')) {
    return 'csharp'
  }

  // TypeScript indicators
  if (code.includes(': string') || code.includes(': number') || code.includes('interface ')) {
    return 'typescript'
  }

  // PHP indicators
  if (code.includes('<?php') || code.includes('$')) {
    return 'php'
  }

  // Ruby indicators
  if (code.includes('def ') && code.includes('end')) {
    return 'ruby'
  }

  // Default to JavaScript
  return 'javascript'
}

/**
 * Transform code from one language to another
 */
export function transformCode(
  code: string,
  sourceLang: string,
  targetLang: string
): TransformationResult {
  if (sourceLang === targetLang) {
    return {
      code,
      lines: code.split('\n').map((line) => ({
        original: line,
        transformed: line,
        warnings: [],
      })),
      warnings: [],
    }
  }

  // Normalize language names
  sourceLang = sourceLang.toLowerCase()
  targetLang = targetLang.toLowerCase()

  const lines = code.split('\n')
  const transformedLines: LineTransformation[] = []
  const allWarnings: Set<string> = new Set()

  for (const line of lines) {
    const result = transformLine(line, sourceLang, targetLang)
    transformedLines.push(result)
    result.warnings.forEach((w) => allWarnings.add(w))
  }

  // Post-process for language-specific cleanup
  const finalCode = transformedLines.map((l) => l.transformed).join('\n')
  const cleanedCode = postProcessCode(finalCode, targetLang)

  return {
    code: cleanedCode,
    lines: transformedLines,
    warnings: Array.from(allWarnings),
  }
}

/**
 * Transform a single line of code
 */
function transformLine(line: string, sourceLang: string, targetLang: string): LineTransformation {
  const indent = line.match(/^\s*/)?.[0] || ''
  const content = line.trim()
  const warnings: string[] = []

  let transformed = line

  // Skip empty lines and comments
  if (!content || content.startsWith('//') || content.startsWith('#') || content.startsWith('/*')) {
    return { original: line, transformed: line, warnings: [] }
  }

  // Apply transformation chain
  transformed = transformFunctions(transformed, sourceLang, targetLang, warnings)
  transformed = transformClasses(transformed, sourceLang, targetLang, warnings)
  transformed = transformConditionals(transformed, sourceLang, targetLang, warnings)
  transformed = transformLoops(transformed, sourceLang, targetLang, warnings)
  transformed = transformPrintStatements(transformed, sourceLang, targetLang, warnings)
  transformed = transformImports(transformed, sourceLang, targetLang, warnings)
  transformed = transformVariables(transformed, sourceLang, targetLang, warnings)
  transformed = transformBooleans(transformed, sourceLang, targetLang, warnings)
  transformed = transformOperators(transformed, sourceLang, targetLang, warnings)
  transformed = transformStatementEndings(transformed, sourceLang, targetLang, warnings)

  return { original: line, transformed, warnings }
}

function transformFunctions(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // Python def -> target language
  if (sourceLang === 'python') {
    line = line.replace(/^(\s*)def\s+(\w+)\s*\((.*?)\)\s*(?:->.*)?:/gm, (_match, indent, name, params) => {
      switch (targetLang) {
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

  // JavaScript function -> target language
  if (sourceLang === 'javascript' || sourceLang === 'typescript') {
    line = line.replace(/^(\s*)(?:async\s+)?function\s+(\w+)\s*\((.*?)\)\s*{/gm, (_match, indent, name, params) => {
      switch (targetLang) {
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

function transformClasses(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // Python class
  if (sourceLang === 'python') {
    line = line.replace(/^(\s*)class\s+(\w+)(?:\((.*?)\))?\s*:/gm, (_match, indent, name, base) => {
      switch (targetLang) {
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
          warnings.push('Go does not have classes, use structs instead')
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

  // Java class
  if (sourceLang === 'java') {
    line = line.replace(/^(\s*)public\s+class\s+(\w+)(?:\s+extends\s+(\w+))?\s*{/gm, (_match, indent, name, base) => {
      switch (targetLang) {
        case 'python':
          return `${indent}class ${name}:`
        case 'javascript':
          return `${indent}class ${name} {`
        case 'csharp':
          return `${indent}public class ${name} {`
        default:
          return line
      }
    })
  }

  return line
}

function transformConditionals(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // if statements
  line = line.replace(/^(\s*)if\s*\((.*?)\)\s*{?\s*:?/gm, (_match, indent, condition) => {
    switch (targetLang) {
      case 'python':
        return `${indent}if ${condition}:`
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'cpp':
      case 'csharp':
      case 'go':
      case 'php':
        return `${indent}if (${condition}) {`
      case 'rust':
        return `${indent}if ${condition} {`
      case 'ruby':
        return `${indent}if ${condition}`
      default:
        return line
    }
  })

  // elif/else if
  line = line.replace(/^(\s*)(?:elif|else\s+if)\s*\((.*?)\)\s*{?\s*:?/gm, (_match, indent, condition) => {
    switch (targetLang) {
      case 'python':
        return `${indent}elif ${condition}:`
      case 'ruby':
        return `${indent}elsif ${condition}`
      case 'go':
        return `${indent}} else if ${condition} {`
      default:
        return `${indent}} else if (${condition}) {`
    }
  })

  // else
  line = line.replace(/^(\s*)else\s*:?\s*{?\s*$/gm, (_match, indent) => {
    switch (targetLang) {
      case 'python':
        return `${indent}else:`
      case 'ruby':
        return `${indent}else`
      default:
        return `${indent}} else {`
    }
  })

  return line
}

function transformLoops(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // for loops - Python style
  if (sourceLang === 'python') {
    line = line.replace(/^(\s*)for\s+(\w+)\s+in\s+(.*?):\s*$/gm, (_match, indent, variable, iterable) => {
      switch (targetLang) {
        case 'javascript':
          return `${indent}for (let ${variable} of ${iterable}) {`
        case 'typescript':
          return `${indent}for (const ${variable} of ${iterable}) {`
        case 'java':
          return `${indent}for (Object ${variable} : ${iterable}) {`
        case 'cpp':
          return `${indent}for (auto ${variable} : ${iterable}) {`
        case 'csharp':
          return `${indent}foreach (var ${variable} in ${iterable}) {`
        case 'go':
          return `${indent}for ${variable} := range ${iterable} {`
        case 'rust':
          return `${indent}for ${variable} in ${iterable} {`
        case 'php':
          return `${indent}foreach (${iterable} as ${variable}) {`
        case 'ruby':
          return `${indent}${iterable}.each do |${variable}|`
        default:
          return line
      }
    })
  }

  // while loops
  line = line.replace(/^(\s*)while\s*\((.*?)\)\s*{?\s*:?\s*$/gm, (_match, indent, condition) => {
    switch (targetLang) {
      case 'python':
        return `${indent}while ${condition}:`
      case 'ruby':
        return `${indent}while ${condition}`
      default:
        return `${indent}while (${condition}) {`
    }
  })

  return line
}

function transformPrintStatements(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // Python print
  if (sourceLang === 'python') {
    line = line.replace(/print\s*\((.*?)\)/g, (_match, args) => {
      switch (targetLang) {
        case 'javascript':
        case 'typescript':
          return `console.log(${args})`
        case 'java':
          return `System.out.println(${args})`
        case 'cpp':
          return `std::cout << ${args} << std::endl`
        case 'csharp':
          return `Console.WriteLine(${args})`
        case 'go':
          return `fmt.Println(${args})`
        case 'rust':
          return `println!("{}", ${args})`
        case 'php':
          return `echo ${args}`
        case 'ruby':
          return `puts ${args}`
        default:
          return _match
      }
    })
  }

  // JavaScript console.log
  if ((sourceLang === 'javascript' || sourceLang === 'typescript') && targetLang === 'python') {
    line = line.replace(/console\.log\s*\((.*?)\)/g, (_match, args) => `print(${args})`)
  }

  return line
}

function transformImports(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // Python imports
  if (sourceLang === 'python') {
    // from X import Y
    line = line.replace(/^(\s*)from\s+(\S+)\s+import\s+(.*)/gm, (_match, indent, module, items) => {
      switch (targetLang) {
        case 'javascript':
        case 'typescript':
          return `${indent}import { ${items} } from '${module}'`
        case 'java':
          return `${indent}import ${module}.${items};`
        case 'go':
          warnings.push('Go uses different import syntax')
          return `${indent}import "${module}"`
        case 'csharp':
          return `${indent}using ${module};`
        default:
          return line
      }
    })

    // import X
    line = line.replace(/^(\s*)import\s+(\S+)/gm, (_match, indent, module) => {
      switch (targetLang) {
        case 'javascript':
        case 'typescript':
          return `${indent}import ${module} from '${module}'`
        case 'java':
          return `${indent}import ${module}.*`
        default:
          return line
      }
    })
  }

  return line
}

function transformVariables(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  // Variable declarations - basic transformation
  if (sourceLang === 'python') {
    // Simple assignment
    line = line.replace(/^(\s*)(\w+)\s*=\s*(.*?)$/gm, (_match, indent, name, value) => {
      if (line.includes('def ') || line.includes('class ')) {
        return line // Skip function/class definitions
      }
      switch (targetLang) {
        case 'javascript':
          return `${indent}let ${name} = ${value};`
        case 'typescript':
          return `${indent}const ${name} = ${value};`
        case 'java':
          return `${indent}Object ${name} = ${value};`
        case 'cpp':
          return `${indent}auto ${name} = ${value};`
        case 'csharp':
          return `${indent}var ${name} = ${value};`
        case 'go':
          return `${indent}${name} := ${value}`
        case 'rust':
          return `${indent}let ${name} = ${value};`
        case 'php':
          return `${indent}$${name} = ${value};`
        case 'ruby':
          return `${indent}${name} = ${value}`
        default:
          return line
      }
    })
  }

  return line
}

function transformBooleans(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  if (sourceLang === 'python') {
    line = line.replace(/\bTrue\b/g, targetLang === 'php' ? 'true' : 'true')
    line = line.replace(/\bFalse\b/g, targetLang === 'php' ? 'false' : 'false')
    line = line.replace(/\bNone\b/g, targetLang === 'php' ? 'null' : 'null')
  }

  if (targetLang === 'python') {
    line = line.replace(/\btrue\b/g, 'True')
    line = line.replace(/\bfalse\b/g, 'False')
    line = line.replace(/\bnull\b/g, 'None')
  }

  return line
}

function transformOperators(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  if (sourceLang === 'python' && targetLang !== 'python') {
    line = line.replace(/\s+and\s+/g, ' && ')
    line = line.replace(/\s+or\s+/g, ' || ')
    line = line.replace(/\s+not\s+/g, ' !')
  }

  if (targetLang === 'python' && sourceLang !== 'python') {
    line = line.replace(/\s*&&\s*/g, ' and ')
    line = line.replace(/\s*\|\|\s*/g, ' or ')
    line = line.replace(/\s*!\s*/g, ' not ')
  }

  return line
}

function transformStatementEndings(
  line: string,
  sourceLang: string,
  targetLang: string,
  warnings: string[]
): string {
  const trimmed = line.trim()

  // Add semicolons where needed
  if (
    targetLang !== 'python' &&
    targetLang !== 'ruby' &&
    !trimmed.endsWith('{') &&
    !trimmed.endsWith('}') &&
    !trimmed.endsWith(':') &&
    !trimmed.endsWith(',') &&
    trimmed.length > 0
  ) {
    if (!line.endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('(')) {
      // Check if this looks like a complete statement
      if (!trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        line = line.replace(/\s*$/, ';')
      }
    }
  }

  return line
}

/**
 * Post-process code for language-specific cleanup
 */
function postProcessCode(code: string, language: string): string {
  const lines = code.split('\n')

  // Add proper indentation tracking
  let indentLevel = 0
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Adjust indentation for closing braces
    if (line.trim().startsWith('}') || line.trim() === 'end') {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Fix indentation
    const indent = '\t'.repeat(indentLevel)
    line = line.replace(/^\s+/, indent)

    result.push(line)

    // Adjust indentation for opening braces
    if (line.trim().endsWith('{')) {
      indentLevel++
    }
  }

  return result.join('\n')
}

/**
 * Parse code into AST-like structure
 */
export function parseToAST(code: string, language: string): CodeNode {
  const lines = code.split('\n')
  const root: CodeNode = {
    type: 'statement',
    content: code,
    lineStart: 0,
    lineEnd: lines.length,
    children: [],
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.includes('function ') || line.includes('def ')) {
      root.children.push({
        type: 'function',
        name: extractName(line),
        content: line,
        lineStart: i,
        lineEnd: i + 1,
        children: [],
      })
    }

    if (line.includes('class ')) {
      root.children.push({
        type: 'class',
        name: extractName(line),
        content: line,
        lineStart: i,
        lineEnd: i + 1,
        children: [],
      })
    }
  }

  return root
}

function extractName(line: string): string {
  const match = line.match(/(?:function|def|class)\s+(\w+)/)
  return match?.[1] || 'unknown'
}

/**
 * Calculate line-by-line changes for diff visualization
 */
export function calculateLineChanges(
  original: string,
  transformed: string
): Array<{ type: 'normal' | 'changed' | 'warning'; content: string }> {
  const origLines = original.split('\n')
  const transLines = transformed.split('\n')
  const result: Array<{ type: 'normal' | 'changed' | 'warning'; content: string }> = []

  const maxLen = Math.max(origLines.length, transLines.length)

  for (let i = 0; i < maxLen; i++) {
    const origLine = origLines[i] || ''
    const transLine = transLines[i] || ''

    if (origLine === transLine) {
      result.push({ type: 'normal', content: transLine })
    } else {
      result.push({ type: 'changed', content: transLine })
    }
  }

  return result
}
