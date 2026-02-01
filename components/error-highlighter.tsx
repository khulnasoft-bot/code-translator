'use client'

import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CodeError {
  lineNumber: number
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

interface ErrorHighlighterProps {
  errors: CodeError[]
  className?: string
}

export function ErrorHighlighter({ errors, className }: ErrorHighlighterProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2 border-l-4 border-destructive bg-destructive/5 p-4', className)}>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <h3 className="font-semibold text-destructive">
          {errors.length} {errors.length === 1 ? 'Issue' : 'Issues'} Found
        </h3>
      </div>

      <div className="space-y-2">
        {errors.map((error, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded border-l-2 p-3 text-xs',
              error.severity === 'error' && 'border-destructive bg-destructive/10',
              error.severity === 'warning' && 'border-yellow-600 bg-yellow-950/10',
              error.severity === 'info' && 'border-blue-600 bg-blue-950/10'
            )}
          >
            <div className="flex items-start gap-2">
              {error.severity === 'error' && <AlertCircle className="mt-0.5 h-3 w-3 text-destructive flex-shrink-0" />}
              {error.severity === 'warning' && <AlertTriangle className="mt-0.5 h-3 w-3 text-yellow-600 flex-shrink-0" />}
              {error.severity === 'info' && <Info className="mt-0.5 h-3 w-3 text-blue-600 flex-shrink-0" />}

              <div className="flex-1">
                <div className="font-semibold">
                  Line {error.lineNumber}: {error.message}
                </div>
                {error.suggestion && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Suggestion: {error.suggestion}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Extract errors from transformation warnings
 */
export function extractErrorsFromWarnings(warnings: string[], lines: Array<{ lineNumber: number; warnings: string[] }> = []): CodeError[] {
  const errors: CodeError[] = []

  warnings.forEach((warning, idx) => {
    // Parse warning patterns
    if (warning.includes('Mixed languages')) {
      errors.push({
        lineNumber: 1,
        severity: 'warning',
        message: 'Mixed language code detected',
        suggestion: 'Code appears to mix multiple programming languages. Check normalization.',
      })
    } else if (warning.includes('does not have classes')) {
      errors.push({
        lineNumber: 1,
        severity: 'info',
        message: 'Language feature conversion',
        suggestion: warning,
      })
    } else if (warning.includes('Normalizing')) {
      errors.push({
        lineNumber: 1,
        severity: 'info',
        message: 'Code normalization applied',
        suggestion: warning,
      })
    } else {
      errors.push({
        lineNumber: 1,
        severity: 'warning',
        message: warning,
      })
    }
  })

  return errors
}
