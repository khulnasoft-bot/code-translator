/**
 * Comprehensive transformation examples including hybrid/mixed input cases
 * Demonstrates Python ↔ JavaScript ↔ Java transformations
 */

export const TRANSFORMATION_EXAMPLES = {
  // Example 1: Python to JavaScript
  pythonToJavaScript: {
    name: 'Python Function to JavaScript',
    input: `def calculate_sum(a, b):
    result = a + b
    print(result)
    return result`,
    expected: `function calculate_sum(a, b) {
  let result = a + b;
  console.log(result);
  return result;
}`,
    description: 'Basic function transformation with variable declaration and print statement',
  },

  // Example 2: JavaScript to Python
  javascriptToPython: {
    name: 'JavaScript Function to Python',
    input: `function calculateSum(a, b) {
  let result = a + b;
  console.log(result);
  return result;
}`,
    expected: `def calculate_sum(a, b):
    result = a + b
    print(result)
    return result`,
    description: 'Function with camelCase converted to snake_case and console.log to print',
  },

  // Example 3: Python with Class to Java
  pythonClassToJava: {
    name: 'Python Class to Java Class',
    input: `class Calculator:
    def __init__(self, value):
        self.value = value
    
    def add(self, x):
        self.value = self.value + x
        return self.value`,
    expected: `public class Calculator {
  private int value;
  
  public Calculator(int value) {
    this.value = value;
  }
  
  public int add(int x) {
    this.value = this.value + x;
    return this.value;
  }
}`,
    description: 'Python class with constructor and methods transformed to Java',
  },

  // Example 4: HYBRID INPUT - Mixed Python and JavaScript syntax
  hybridPythonJavaScript: {
    name: 'Hybrid Python/JavaScript Input',
    input: `def process_data(items)
    const result = []
    for item in items:
        if item > 10 {
            result.append(item)
        }
    print(result)
    return result`,
    normalized: `def process_data(items):
    let result = [];
    for item in items:
        if item > 10:
            result.append(item);
    print(result);
    return result;`,
    expected: `function process_data(items) {
  let result = [];
  for (let item of items) {
    if (item > 10) {
      result.push(item);
    }
  }
  console.log(result);
  return result;
}`,
    description: 'Mixed Python/JavaScript syntax normalized and converted to pure JavaScript',
  },

  // Example 5: HYBRID - Multiple control structures
  hybridControlStructures: {
    name: 'Hybrid Control Structures',
    input: `def validate_input(data):
    if data == None {
        return False
    elif len(data) > 0:
        for item in data
            print(item)
    else
        console.log("Empty")
    return True`,
    expected: `function validate_input(data) {
  if (data == null) {
    return false;
  } else if (data.length > 0) {
    for (let item of data) {
      console.log(item);
    }
  } else {
    console.log("Empty");
  }
  return true;
}`,
    description: 'Mixed if/elif/else with print and console.log, fixes missing colons and braces',
  },

  // Example 6: Loop transformations
  loopTransformations: {
    name: 'Loop Transformations',
    input: `for i in range(10):
    print(i)

for let j = 0; j < 5: {
    console.log(j)
}`,
    expected: `for (let i = 0; i < 10; i++) {
  console.log(i);
}

for (let j = 0; j < 5; j++) {
  console.log(j);
}`,
    description: 'Python range loop and hybrid for-loop syntax to JavaScript for loops',
  },

  // Example 7: Complex hybrid with imports
  hybridWithImports: {
    name: 'Hybrid Code with Imports',
    input: `from math import sqrt
import sys
    
def calculate(x):
    result = sqrt(x)
    print result
    return result`,
    expected: `import Math from 'math';
import Sys from 'sys';

function calculate(x) {
  let result = Math.sqrt(x);
  console.log(result);
  return result;
}`,
    description: 'Mixed import statements normalized and converted to JavaScript',
  },

  // Example 8: Python to Java with List transformations
  pythonListToJavaArray: {
    name: 'Python List Operations to Java',
    input: `def process_list(items):
    items.append(5)
    items.remove(3)
    for i in items:
        print(i)`,
    expected: `public static void process_list(List<Integer> items) {
  items.add(5);
  items.remove(Integer.valueOf(3));
  for (int i : items) {
    System.out.println(i);
  }
}`,
    description: 'Python list methods converted to Java List operations',
  },

  // Example 9: Hybrid with boolean operators
  hybridBooleanOperators: {
    name: 'Hybrid Boolean Operators',
    input: `if x > 5 and y < 10:
    if not (a || b) {
        print("OK")`,
    expected: `if (x > 5 && y < 10) {
  if (!(a || b)) {
    console.log("OK");
  }
}`,
    description: 'Mixed Python (and, not) and JavaScript (||) operators normalized to JavaScript',
  },

  // Example 10: Error recovery - missing syntax elements
  errorRecovery: {
    name: 'Error Recovery with Missing Syntax',
    input: `def helper(x)
    if x > 0
        return x * 2
    else
        return 0`,
    expected: `function helper(x) {
  if (x > 0) {
    return x * 2;
  } else {
    return 0;
  }
}`,
    description: 'Auto-corrects missing colons and braces during normalization',
  },
}

// Test runner
export function runTransformationTest(
  exampleKey: keyof typeof TRANSFORMATION_EXAMPLES,
  transformFn: (code: string, from: string, to: string) => { code: string }
): {
  passed: boolean
  actual: string
  expected: string
  differences: string[]
} {
  const example = TRANSFORMATION_EXAMPLES[exampleKey]
  const result = transformFn(example.input, 'auto', 'javascript')
  const differences: string[] = []

  // Normalize whitespace for comparison
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim()

  if (normalize(result.code) !== normalize(example.expected)) {
    differences.push(`Expected:\n${example.expected}`)
    differences.push(`Got:\n${result.code}`)
  }

  return {
    passed: normalize(result.code) === normalize(example.expected),
    actual: result.code,
    expected: example.expected,
    differences,
  }
}

export function getExampleDescription(key: keyof typeof TRANSFORMATION_EXAMPLES): string {
  return TRANSFORMATION_EXAMPLES[key]?.description || 'No description'
}
