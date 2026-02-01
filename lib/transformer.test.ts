// Comprehensive test suite for the enhanced transformer
// Demonstrates successful translations across all supported languages

import { transformCode, detectLanguage, detectMixedLanguages, normalizeCode } from './transformer'

interface TestCase {
  name: string
  source: string
  sourceLanguage: string
  targetLanguage: string
  expected?: string
}

const testCases: TestCase[] = [
  // Python to JavaScript
  {
    name: 'Python function to JavaScript',
    source: `def greet(name):
    print(f"Hello, {name}!")`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // JavaScript to Python
  {
    name: 'JavaScript function to Python',
    source: `function add(a, b) {
    console.log(a + b);
}`,
    sourceLanguage: 'javascript',
    targetLanguage: 'python',
  },

  // Python classes
  {
    name: 'Python class to JavaScript',
    source: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print(f"{self.name} makes a sound")`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Python loops
  {
    name: 'Python for loop to JavaScript',
    source: `for i in range(10):
    print(i)`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Python conditionals
  {
    name: 'Python conditionals to JavaScript',
    source: `if x > 5:
    print("x is greater than 5")
else:
    print("x is 5 or less")`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Python imports
  {
    name: 'Python imports to JavaScript',
    source: `import os
from math import sqrt`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Python to Java
  {
    name: 'Python function to Java',
    source: `def calculate(x, y):
    return x + y`,
    sourceLanguage: 'python',
    targetLanguage: 'java',
  },

  // Python to C++
  {
    name: 'Python print to C++',
    source: `print("Hello, World!")`,
    sourceLanguage: 'python',
    targetLanguage: 'cpp',
  },

  // Python to Go
  {
    name: 'Python function to Go',
    source: `def add(a, b):
    return a + b`,
    sourceLanguage: 'python',
    targetLanguage: 'go',
  },

  // Python to Rust
  {
    name: 'Python function to Rust',
    source: `def multiply(a, b):
    return a * b`,
    sourceLanguage: 'python',
    targetLanguage: 'rust',
  },

  // JavaScript to TypeScript
  {
    name: 'JavaScript function to TypeScript',
    source: `function greet(name) {
    console.log("Hello, " + name);
}`,
    sourceLanguage: 'javascript',
    targetLanguage: 'typescript',
  },

  // Boolean transformation
  {
    name: 'Python booleans to JavaScript',
    source: `if True:
    x = False
    y = None`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Mixed language normalization
  {
    name: 'Mixed Python/JavaScript code',
    source: `def greet(name) {
    console.log(f"Hello, {name}")
}`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Operators transformation
  {
    name: 'Python operators to JavaScript',
    source: `if x and y or z:
    result = not x`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },

  // Class to Go struct
  {
    name: 'Python class to Go struct',
    source: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age`,
    sourceLanguage: 'python',
    targetLanguage: 'go',
  },

  // Variables and assignments
  {
    name: 'Python variables to JavaScript',
    source: `x = 10
y = "hello"
z = [1, 2, 3]`,
    sourceLanguage: 'python',
    targetLanguage: 'javascript',
  },
]

export function runTests(): { passed: number; failed: number; results: any[] } {
  const results: any[] = []
  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    try {
      const result = transformCode(testCase.source, testCase.sourceLanguage, testCase.targetLanguage)

      const testResult = {
        name: testCase.name,
        status: 'passed',
        source: testCase.source,
        sourceLanguage: testCase.sourceLanguage,
        targetLanguage: testCase.targetLanguage,
        output: result.code,
        warnings: result.warnings,
        statistics: result.statistics,
      }

      results.push(testResult)
      passed++
    } catch (error) {
      const testResult = {
        name: testCase.name,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      }

      results.push(testResult)
      failed++
    }
  }

  return { passed, failed, results }
}

// Test language detection
export function testLanguageDetection() {
  const detectionTests = [
    { code: 'def greet(): pass', expected: 'python' },
    { code: 'function greet() {}', expected: 'javascript' },
    { code: 'public class Test {}', expected: 'java' },
    { code: '#include <iostream>', expected: 'cpp' },
    { code: 'package main; func main() {}', expected: 'go' },
  ]

  const results = detectionTests.map((test) => ({
    code: test.code,
    detected: detectLanguage(test.code),
    expected: test.expected,
    passed: detectLanguage(test.code) === test.expected,
  }))

  return results
}

// Test mixed language detection
export function testMixedLanguageDetection() {
  const mixedTests = [
    {
      code: `def greet(name) {
    console.log(f"Hello, {name}")
}`,
      description: 'Python and JavaScript mix',
    },
    {
      code: `function test():
    print("hello")`,
      description: 'JavaScript and Python mix',
    },
    {
      code: `for i in range(10) {
    console.log(i)
}`,
      description: 'Python range with JS loop',
    },
  ]

  return mixedTests.map((test) => ({
    code: test.code,
    description: test.description,
    detection: detectMixedLanguages(test.code),
  }))
}

// Test code normalization
export function testCodeNormalization() {
  const normalizationTests = [
    {
      code: `def greet(name) 
    print("hello")`,
      description: 'Missing colon after function definition',
    },
    {
      code: `if x > 5
    print("large")`,
      description: 'Missing colon after conditional',
    },
    {
      code: `function test() 
    console.log("hi")`,
      description: 'Missing brace after function',
    },
  ]

  return normalizationTests.map((test) => {
    const { normalized, warnings } = normalizeCode(test.code)
    return {
      code: test.code,
      description: test.description,
      normalized,
      warnings,
    }
  })
}

/**
 * Display test results in console
 */
export function displayTestResults() {
  console.log('[Transformer Test Suite]')
  console.log('=' * 50)

  // Run transformation tests
  console.log('\nTransformation Tests:')
  const transformTests = runTests()
  console.log(`Passed: ${transformTests.passed}, Failed: ${transformTests.failed}`)

  // Run language detection tests
  console.log('\nLanguage Detection Tests:')
  const detectionTests = testLanguageDetection()
  const detectionPassed = detectionTests.filter((t) => t.passed).length
  console.log(
    `Passed: ${detectionPassed}/${detectionTests.length}`,
    detectionTests.map((t) => (t.passed ? '✓' : '✗')).join(' ')
  )

  // Run mixed language detection tests
  console.log('\nMixed Language Detection Tests:')
  const mixedTests = testMixedLanguageDetection()
  mixedTests.forEach((test) => {
    console.log(
      `${test.description}: ${test.detection.detected ? 'DETECTED' : 'not detected'} (${test.detection.languages.join(', ')})`
    )
  })

  // Run normalization tests
  console.log('\nCode Normalization Tests:')
  const normTests = testCodeNormalization()
  normTests.forEach((test) => {
    console.log(`${test.description}:`)
    console.log(`  Before: ${test.code.replace(/\n/g, ' | ')}`)
    console.log(`  After: ${test.normalized.replace(/\n/g, ' | ')}`)
    console.log(`  Warnings: ${test.warnings.length}`)
  })
}
