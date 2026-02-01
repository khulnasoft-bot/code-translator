# Rule-Based Multi-Language Code Translator

A fully functional, rule-based code translator built with Next.js 16 and React 19 that translates code between 10 programming languages using deterministic transformations—no AI required.

## Supported Languages

- Python
- JavaScript
- TypeScript
- Java
- C++
- Go
- Rust
- C#
- PHP
- Ruby

## Features

### Core Translation Engine

- **Rule-Based Transformation**: Uses regex patterns and AST-like parsing for deterministic, fast translations
- **Language Auto-Detection**: Automatically detects source code language
- **Line-by-Line Transformations**: Handles functions, classes, loops, conditionals, imports, variables, operators, and more
- **Comprehensive Language Support**: Full bidirectional translation between all 10 languages

### IDE-Like Frontend

- **Split-Pane Layout**: Source code on left, translated code on right
- **Real-Time Translation**: Updates automatically as you type
- **Syntax Highlighting**: Color-coded keywords, strings, comments per language
- **Dark Theme by Default**: Developer-friendly dark interface with modern aesthetics

### Advanced Features

1. **Multi-File Translation**
   - Manage multiple files in tabs
   - Translate individual files or all files at once
   - Add/remove files dynamically

2. **Line Highlighting**
   - Green highlighting for changed lines
   - Yellow for warning lines (unsupported constructs)
   - Easy-to-spot modifications

3. **Side-by-Side Diff View**
   - Visual comparison of source vs. translated code
   - Added/removed/unchanged line indicators
   - Statistics on changes

4. **AST Visualization**
   - Parse and visualize code structure
   - Show functions, classes, and statements
   - Collapsible tree view

5. **Export & Download**
   - Copy translated code to clipboard
   - Download individual files with correct extensions
   - Export all files as ZIP archive

## Project Structure

```
app/
├── layout.tsx                    # Root layout with theme
├── page.tsx                      # Main page (uses MultiFileTranslator)
└── api/
    └── translate/
        └── route.ts             # Translation API endpoint

components/
├── multi-file-translator.tsx     # Main UI component
├── code-editor.tsx               # Code editor with highlighting
├── file-manager.tsx              # File tab management
├── diff-viewer.tsx               # Side-by-side diff visualization
├── ast-visualizer.tsx            # AST tree visualization
├── language-selector.tsx         # Language dropdown
├── help-modal.tsx                # Help documentation
├── settings-panel.tsx            # User preferences
├── session-history.tsx           # Recent translations
├── file-handler.tsx              # Import/export files
└── top-bar.tsx                   # Header navigation

lib/
├── transformer.ts                # Core transformation engine
├── utils.ts                      # Utility functions
└── code-transformer.ts           # Legacy transformer (deprecated)

styles/
└── globals.css                   # Global styles with design tokens
```

## Transformation Rules

### Functions

Converts function definitions across languages:

```python
# Python
def greet(name):
    return f"Hello, {name}"

// JavaScript
function greet(name) {
    return `Hello, ${name}`
}

// Java
public static Object greet(String name) {
    return "Hello, " + name;
}
```

### Classes

Translates class definitions with appropriate syntax:

```python
# Python
class Person:
    def __init__(self, name):
        self.name = name

// JavaScript
class Person {
    constructor(name) {
        this.name = name
    }
}

// Go (uses structs)
type Person struct {
    name string
}
```

### Loops

Handles for and while loops intelligently:

```python
# Python
for i in range(10):
    print(i)

// JavaScript
for (let i of range(10)) {
    console.log(i)
}

// Go
for i := range 10 {
    fmt.Println(i)
}
```

### Conditionals

Translates if/elif/else chains:

```python
# Python
if x > 5:
    print("Greater")
elif x < 5:
    print("Less")
else:
    print("Equal")

// JavaScript
if (x > 5) {
    console.log("Greater")
} else if (x < 5) {
    console.log("Less")
} else {
    console.log("Equal")
}
```

### Print/Log Statements

Maps print functions to language-specific output:

```python
print("Hello")        # Python
console.log("Hello")  # JavaScript
System.out.println("Hello")  # Java
std::cout << "Hello"  # C++
fmt.Println("Hello")  # Go
```

### Imports

Handles module imports intelligently:

```python
# Python
from os import path
import json

// JavaScript
import { path } from 'os'
import json from 'json'

// Java
import os.path.*
import java.json.*
```

### Variables & Assignments

Converts variable declarations with language idioms:

```python
x = 5  # Python

let x = 5  // JavaScript
const x = 5  // TypeScript (preferred)
Object x = 5  // Java
var x = 5  // C#
x := 5  // Go
let x = 5;  // Rust
$x = 5  // PHP
x = 5  # Ruby
```

### Boolean & Constants

Maps boolean values and keywords:

```python
True  -> true
False -> false
None  -> null
and   -> &&
or    -> ||
not   -> !
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Building

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

## Usage

1. **Select or paste code** in the left editor
2. **Choose target language** from dropdown (auto-detects source)
3. **View real-time translation** on the right
4. **Toggle diff view** to see exact changes (GitCompare icon)
5. **View AST** to understand code structure (BarChart icon)
6. **Copy or download** the translated code

### Multi-File Translation

1. Click **+ button** in file manager to add new files
2. Click **Translate All** to convert all files at once
3. Switch between files using tabs
4. Click **Download** to export all as ZIP

## API Endpoint

### POST `/api/translate`

Translates code from one language to another.

**Request:**
```json
{
  "code": "def hello(name):\n    print(f'Hello, {name}')",
  "sourceLanguage": "python",
  "targetLanguage": "javascript"
}
```

**Response:**
```
text/event-stream with SSE chunks containing:
{
  "type": "delta",
  "delta": "function hello(name) {",
  "fullText": "function hello(name) { ... "
}
```

## Design System

### Colors

- **Background**: `oklch(0.12 0 0)` - Deep dark
- **Primary**: `oklch(0.56 0.196 272.7)` - Purple
- **Accent**: `oklch(0.6 0.2 300)` - Light purple
- **Code Background**: `oklch(0.13 0 0)` - Slightly lighter dark
- **Changed Lines**: Green (`oklch(0.56 0.196 100)`)
- **Warning Lines**: Yellow (`oklch(0.6 0.196 100)`)

### Typography

- **Sans Font**: Geist (headings, UI)
- **Mono Font**: Geist Mono (code editor, AST)

### Layout

- Uses Flexbox for responsive layouts
- Tailwind CSS v4 with semantic design tokens
- Gap-based spacing system
- Mobile-first responsive design

## Adding New Languages

To add a new language to the translator:

1. Add language name to `SUPPORTED_LANGUAGES` in `/lib/transformer.ts`
2. Add detection logic in `detectLanguage()` function
3. Create transformation rules for each existing language pair
4. Add file extension to `getExtension()` helper
5. Update language selector in components

Example transformation rule:

```typescript
function transformFunctions(line, sourceLang, targetLang, warnings) {
  if (sourceLang === 'python' && targetLang === 'newlang') {
    line = line.replace(/^(\s*)def\s+(\w+)\s*\((.*?)\):/gm, 
      (match, indent, name, params) => `${indent}func ${name}(${params})`
    )
  }
  return line
}
```

## Performance

- **No external API calls** - All processing happens locally
- **Instant translation** - Rule-based transformations complete in milliseconds
- **Streaming response** - Simulates real-time feedback for large files
- **Efficient parsing** - Lightweight AST-like structure for visualization

## Limitations

- Line-by-line transformation (doesn't reformat code structure)
- Limited to common language constructs (advanced features may need manual review)
- Warns on unsupported patterns but includes comments for reference
- Requires proper syntax in source language for accurate translation

## Future Enhancements

- Undo/redo history for individual files
- Batch processing with progress tracking
- Custom transformation rules editor
- Syntax error detection and warnings
- Code style/formatting preferences
- Integration with version control
- Collaborative translation workspace
- Language-specific comment preservation

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.
