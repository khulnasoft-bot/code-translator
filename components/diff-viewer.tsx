'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { calculateLineChanges } from '@/lib/transformer'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'changed' | 'warning'
  sourceLine: string
  translatedLine: string
  lineNumber: number
}

interface DiffViewerProps {
  sourceCode: string
  translatedCode: string
  className?: string
}

function computeDiff(source: string, translated: string): DiffLine[] {
  const sourceLines = source.split('\n')
  const translatedLines = translated.split('\n')
  const lineChanges = calculateLineChanges(source, translated)

  const maxLength = Math.max(sourceLines.length, translatedLines.length)
  const diffs: DiffLine[] = []

  for (let i = 0; i < maxLength; i++) {
    const sourceLine = sourceLines[i] || ''
    const translatedLine = translatedLines[i] || ''
    const changeType = lineChanges[i]?.type || 'unchanged'

    if (!sourceLine && translatedLine) {
      diffs.push({
        type: 'added',
        sourceLine: '',
        translatedLine,
        lineNumber: i + 1,
      })
    } else if (sourceLine && !translatedLine) {
      diffs.push({
        type: 'removed',
        sourceLine,
        translatedLine: '',
        lineNumber: i + 1,
      })
    } else if (sourceLine === translatedLine) {
      diffs.push({
        type: 'unchanged',
        sourceLine,
        translatedLine,
        lineNumber: i + 1,
      })
    } else {
      // Lines changed - mark both as modified
      diffs.push({
        type: 'removed',
        sourceLine,
        translatedLine: '',
        lineNumber: i + 1,
      })
      diffs.push({
        type: 'added',
        sourceLine: '',
        translatedLine,
        lineNumber: i + 1,
      })
    }
  }

  return diffs
}

export function DiffViewer({
  sourceCode,
  translatedCode,
  className,
}: DiffViewerProps) {
  const diffs = useMemo(
    () => computeDiff(sourceCode, translatedCode),
    [sourceCode, translatedCode]
  )

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    let unchanged = 0

    diffs.forEach((diff) => {
      if (diff.type === 'added') added++
      else if (diff.type === 'removed') removed++
      else unchanged++
    })

    return { added, removed, unchanged }
  }, [diffs])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Stats */}
      <div className="flex gap-4 px-4 py-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-green-400/60" />
          <span className="text-muted-foreground">
            {stats.added} added
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="text-muted-foreground">
            {stats.removed} removed
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-gray-400/60" />
          <span className="text-muted-foreground">
            {stats.unchanged} unchanged
          </span>
        </div>
      </div>

      {/* Diff Lines */}
      <div className="space-y-px overflow-auto px-4">
        {diffs.map((diff, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-2 font-mono text-xs',
              diff.type === 'added' && 'bg-green-950/20',
              diff.type === 'removed' && 'bg-red-950/20',
              diff.type === 'unchanged' && 'bg-transparent'
            )}
          >
            {/* Indicator */}
            <div
              className={cn(
                'flex w-6 flex-shrink-0 items-center justify-center',
                diff.type === 'added' && 'text-green-400',
                diff.type === 'removed' && 'text-red-400',
                diff.type === 'unchanged' && 'text-muted-foreground'
              )}
            >
              {diff.type === 'added' && '+'}
              {diff.type === 'removed' && '-'}
              {diff.type === 'unchanged' && ' '}
            </div>

            {/* Content */}
            <div className="flex-1 truncate py-1 text-foreground">
              {diff.sourceLine || diff.translatedLine}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
