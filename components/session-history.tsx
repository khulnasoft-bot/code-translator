'use client'

import { useEffect, useState } from 'react'
import { Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HistoryEntry {
  id: string
  sourceLanguage: string
  targetLanguage: string
  sourceCode: string
  translatedCode: string
  timestamp: number
}

interface SessionHistoryProps {
  onRestore: (entry: HistoryEntry) => void
}

export function SessionHistory({ onRestore }: SessionHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('translation-history')
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        // Invalid JSON, skip
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('translation-history', JSON.stringify(history))
    }
  }, [history])

  const addEntry = (
    sourceLanguage: string,
    targetLanguage: string,
    sourceCode: string,
    translatedCode: string
  ) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      sourceLanguage,
      targetLanguage,
      sourceCode,
      translatedCode,
      timestamp: Date.now(),
    }
    setHistory((prev) => [entry, ...prev].slice(0, 20)) // Keep last 20
  }

  const removeEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('translation-history')
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No translation history yet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Translations
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={clearHistory}
          className="h-6 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      </div>

      <div className="max-h-64 space-y-1 overflow-auto">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded border border-border/50 bg-secondary/30 p-2 transition-colors hover:bg-secondary/50"
          >
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium text-foreground">
                {entry.sourceLanguage} → {entry.targetLanguage}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {entry.sourceCode.substring(0, 40)}...
              </p>
              <p className="text-xs text-muted-foreground/60">
                {formatTime(entry.timestamp)}
              </p>
            </div>
            <div className="ml-2 flex gap-1 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRestore(entry)}
                className="h-6 w-6 p-0"
                title="Restore this translation"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeEntry(entry.id)}
                className="h-6 w-6 p-0"
                title="Remove from history"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export a hook for adding entries
export function useSessionHistory() {
  const [, setHistory] = useState<HistoryEntry[]>([])

  const addEntry = (
    sourceLanguage: string,
    targetLanguage: string,
    sourceCode: string,
    translatedCode: string
  ) => {
    const stored = localStorage.getItem('translation-history')
    const history: HistoryEntry[] = stored ? JSON.parse(stored) : []

    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      sourceLanguage,
      targetLanguage,
      sourceCode,
      translatedCode,
      timestamp: Date.now(),
    }

    const updated = [entry, ...history].slice(0, 20)
    localStorage.setItem('translation-history', JSON.stringify(updated))
    setHistory(updated)
  }

  return { addEntry }
}

export type { HistoryEntry }
