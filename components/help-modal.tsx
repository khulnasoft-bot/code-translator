'use client'

import { X, Keyboard, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-card p-6 text-foreground shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Help & Tips</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Features Section */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Real-time translation:</strong> Code updates automatically as you type</li>
              <li>• <strong>Multi-language support:</strong> Translate between 12+ programming languages</li>
              <li>• <strong>Syntax highlighting:</strong> Color-coded keywords and strings for better readability</li>
              <li>• <strong>Diff view:</strong> See line-by-line changes between source and translated code</li>
              <li>• <strong>File upload:</strong> Import code files directly from your computer</li>
              <li>• <strong>Download exports:</strong> Save translated code with correct file extensions</li>
              <li>• <strong>Auto-detection:</strong> Language auto-detection for uploaded files</li>
            </ul>
          </div>

          {/* Tips Section */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Start with simpler code snippets for more accurate translations</li>
              <li>• Complex algorithms may need manual adjustments after translation</li>
              <li>• Use the diff view to understand how structures changed</li>
              <li>• Check library availability in the target language</li>
              <li>• Test translated code before using in production</li>
              <li>• Comment your source code for better translation context</li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div>
            <h3 className="mb-3 font-semibold">Supported Languages</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Python</div>
              <div>• JavaScript</div>
              <div>• TypeScript</div>
              <div>• Java</div>
              <div>• C++</div>
              <div>• C#</div>
              <div>• Go</div>
              <div>• Rust</div>
              <div>• R</div>
              <div>• PHP</div>
              <div>• Ruby</div>
              <div>• Swift</div>
            </div>
          </div>

          {/* Limitations */}
          <div>
            <h3 className="mb-3 font-semibold">Limitations</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Platform-specific code may not translate automatically</li>
              <li>• External libraries must be manually updated</li>
              <li>• Performance characteristics may differ between languages</li>
              <li>• Always verify translated code for correctness</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  )
}
