// Rule-based code transformer for language-to-language conversion
// Supports: Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#, PHP, Ruby

interface TransformationRule {
  pattern: RegExp
  replacement: (match: string, ...args: any[]) => string
}

const PYTHON_TO_OTHER: Record<string, TransformationRule[]> = {
  javascript: [
    { pattern: /^(\s*)def\s+(\w+)\s*\((.*?)\):/gm, replacement: (match, indent, name, params) => `${indent}function ${name}(${params}) {` },
    { pattern: /^(\s*)class\s+(\w+)(\(.*?\))?:/gm, replacement: (match, indent, name) => `${indent}class ${name} {` },
    { pattern: /^(\s*)if\s+(.*?):/gm, replacement: (match, indent, condition) => `${indent}if (${condition}) {` },
    { pattern: /^(\s*)elif\s+(.*?):/gm, replacement: (match, indent, condition) => `${indent}} else if (${condition}) {` },
    { pattern: /^(\s*)else:/gm, replacement: (match, indent) => `${indent}} else {` },
    { pattern: /^(\s*)for\s+(\w+)\s+in\s+(.*?):/gm, replacement: (match, indent, var_, iter) => `${indent}for (let ${var_} of ${iter}) {` },
    { pattern: /^(\s*)while\s+(.*?):/gm, replacement: (match, indent, condition) => `${indent}while (${condition}) {` },
    { pattern: /^(\s*)(.*?)=/gm, replacement: (match, indent, expr) => `${indent}${expr};` },
    { pattern: /print\s*\((.*?)\)/g, replacement: (match, content) => `console.log(${content})` },
    { pattern: /import\s+(\w+)/g, replacement: (match, module) => `import ${module}` },
    { pattern: /from\s+(\w+)\s+import\s+(.*)/g, replacement: (match, module, items) => `import { ${items} } from '${module}'` },
    { pattern: /True/g, replacement: 'true' },
    { pattern: /False/g, replacement: 'false' },
    { pattern: /None/g, replacement: 'null' },
    { pattern: /and\s+/g, replacement: ' && ' },
    { pattern: /or\s+/g, replacement: ' || ' },
    { pattern: /not\s+/g, replacement: '!' },
    { pattern: /len\s*\(/g, replacement: '.length' },
    { pattern: /\[\s*:\s*-?1\s*\]/g, replacement: '.reverse()' },
  ],
  java: [
    { pattern: /^(\s*)def\s+(\w+)\s*\((.*?)\):/gm, replacement: (match, indent, name, params) => `${indent}public static Object ${name}(${params}) {` },
    { pattern: /^(\s*)class\s+(\w+)(\(.*?\))?:/gm, replacement: (match, indent, name) => `${indent}public class ${name} {` },
    { pattern: /^(\s*)if\s+(.*?):/gm, replacement: (match, indent, condition) => `${indent}if (${condition}) {` },
    { pattern: /^(\s*)for\s+(\w+)\s+in\s+(.*?):/gm, replacement: (match, indent, var_, iter) => `${indent}for (Object ${var_} : ${iter}) {` },
    { pattern: /print\s*\((.*?)\)/g, replacement: (match, content) => `System.out.println(${content})` },
    { pattern: /True/g, replacement: 'true' },
    { pattern: /False/g, replacement: 'false' },
    { pattern: /None/g, replacement: 'null' },
  ],
  cpp: [
    { pattern: /^(\s*)def\s+(\w+)\s*\((.*?)\):/gm, replacement: (match, indent, name, params) => `${indent}void ${name}(${params}) {` },
    { pattern: /^(\s*)class\s+(\w+)(\(.*?\))?:/gm, replacement: (match, indent, name) => `${indent}class ${name} {` },
    { pattern: /print\s*\((.*?)\)/g, replacement: (match, content) => `std::cout << ${content} << std::endl` },
    { pattern: /True/g, replacement: 'true' },
    { pattern: /False/g, replacement: 'false' },
  ],
}

const JAVASCRIPT_TO_OTHER: Record<string, TransformationRule[]> = {
  python: [
    { pattern: /function\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `def ${name}(${params}):` },
    { pattern: /const\s+(\w+)\s*=/g, replacement: (match, name) => `${name} =` },
    { pattern: /let\s+(\w+)\s*=/g, replacement: (match, name) => `${name} =` },
    { pattern: /if\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `if ${condition}:` },
    { pattern: /else\s*if\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `elif ${condition}:` },
    { pattern: /else\s*\{/gm, replacement: 'else:' },
    { pattern: /for\s*\(\s*let\s+(\w+)\s+of\s+(.*?)\)\s*\{/gm, replacement: (match, var_, iter) => `for ${var_} in ${iter}:` },
    { pattern: /while\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `while ${condition}:` },
    { pattern: /console\.log\s*\((.*?)\)/g, replacement: (match, content) => `print(${content})` },
    { pattern: /import\s+\{\s*(.*?)\s*\}\s+from\s+['"]([^'"]+)['"]/g, replacement: (match, items, module) => `from ${module} import ${items}` },
    { pattern: /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, replacement: (match, name, module) => `import ${name}` },
    { pattern: /\}\s*(?=\n|$)/gm, replacement: '' },
    { pattern: /true/g, replacement: 'True' },
    { pattern: /false/g, replacement: 'False' },
    { pattern: /null/g, replacement: 'None' },
    { pattern: /&&/g, replacement: 'and' },
    { pattern: /\|\|/g, replacement: 'or' },
    { pattern: /!/g, replacement: 'not ' },
    { pattern: /\.length/g, replacement: ' len()' },
  ],
  java: [
    { pattern: /function\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `public static Object ${name}(${params}) {` },
    { pattern: /const\s+(\w+)\s*=/g, replacement: (match, name) => `Object ${name} =` },
    { pattern: /console\.log\s*\((.*?)\)/g, replacement: (match, content) => `System.out.println(${content})` },
    { pattern: /true/g, replacement: 'true' },
    { pattern: /false/g, replacement: 'false' },
  ],
  cpp: [
    { pattern: /function\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `void ${name}(${params}) {` },
    { pattern: /const\s+(\w+)\s*=/g, replacement: (match, name) => `auto ${name} =` },
    { pattern: /console\.log\s*\((.*?)\)/g, replacement: (match, content) => `std::cout << ${content} << std::endl;` },
  ],
}

const JAVA_TO_OTHER: Record<string, TransformationRule[]> = {
  python: [
    { pattern: /public\s+static\s+\w+\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `def ${name}(${params}):` },
    { pattern: /if\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `if ${condition}:` },
    { pattern: /for\s*\(\s*\w+\s+(\w+)\s*:\s*(.*?)\)\s*\{/gm, replacement: (match, var_, iter) => `for ${var_} in ${iter}:` },
    { pattern: /System\.out\.println\s*\((.*?)\)/g, replacement: (match, content) => `print(${content})` },
    { pattern: /true/g, replacement: 'True' },
    { pattern: /false/g, replacement: 'False' },
    { pattern: /null/g, replacement: 'None' },
  ],
  javascript: [
    { pattern: /public\s+static\s+\w+\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `function ${name}(${params}) {` },
    { pattern: /if\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `if (${condition}) {` },
    { pattern: /for\s*\(\s*\w+\s+(\w+)\s*:\s*(.*?)\)\s*\{/gm, replacement: (match, var_, iter) => `for (let ${var_} of ${iter}) {` },
    { pattern: /System\.out\.println\s*\((.*?)\)/g, replacement: (match, content) => `console.log(${content})` },
  ],
}

const CPP_TO_OTHER: Record<string, TransformationRule[]> = {
  python: [
    { pattern: /void\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `def ${name}(${params}):` },
    { pattern: /std::cout\s*<<\s*(.*?)\s*<<\s*std::endl;?/g, replacement: (match, content) => `print(${content})` },
    { pattern: /if\s*\((.*?)\)\s*\{/gm, replacement: (match, condition) => `if ${condition}:` },
  ],
  javascript: [
    { pattern: /void\s+(\w+)\s*\((.*?)\)\s*\{/gm, replacement: (match, name, params) => `function ${name}(${params}) {` },
    { pattern: /std::cout\s*<<\s*(.*?)\s*<<\s*std::endl;?/g, replacement: (match, content) => `console.log(${content})` },
  ],
}

const transformationMap: Record<string, Record<string, TransformationRule[]>> = {
  python: PYTHON_TO_OTHER,
  javascript: JAVASCRIPT_TO_OTHER,
  typescript: JAVASCRIPT_TO_OTHER,
  java: JAVA_TO_OTHER,
  cpp: CPP_TO_OTHER,
  'c++': CPP_TO_OTHER,
}

export function transformCode(
  sourceCode: string,
  sourceLanguage: string,
  targetLanguage: string
): string {
  // Normalize language names
  const source = sourceLanguage.toLowerCase()
  const target = targetLanguage.toLowerCase()

  // If same language, return as-is
  if (source === target) {
    return sourceCode
  }

  // Get transformation rules
  const rules = transformationMap[source]?.[target]

  if (!rules) {
    // Fallback: return code with a comment
    return `// Translation from ${sourceLanguage} to ${targetLanguage} not fully supported yet\n// Please manually review the converted code\n\n${sourceCode}`
  }

  let transformed = sourceCode

  // Apply each transformation rule
  for (const rule of rules) {
    transformed = transformed.replace(rule.pattern, rule.replacement)
  }

  // Clean up extra whitespace and closing braces
  transformed = transformed
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')

  return transformed
}

export function detectLanguage(code: string): string {
  code = code.toLowerCase()

  if (code.includes('def ') || code.includes('import ') || /^[ ]{2,}\S/m.test(code)) {
    return 'python'
  }
  if (code.includes('function') || code.includes('const ') || code.includes('let ')) {
    return 'javascript'
  }
  if (code.includes('public class') || code.includes('private void') || code.includes('System.out')) {
    return 'java'
  }
  if (code.includes('#include') || code.includes('std::')) {
    return 'cpp'
  }
  if (code.includes('func ') || code.includes(':= ')) {
    return 'go'
  }
  if (code.includes('fn ') || code.includes('fn main')) {
    return 'rust'
  }

  return 'javascript'
}

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
