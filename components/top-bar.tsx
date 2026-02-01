'use client'

import { Code2, BookOpen, Settings, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onHelp?: () => void
  onSettings?: () => void
  onHistory?: () => void
  historyActive?: boolean
}

export function TopBar({ onHelp, onSettings, onHistory, historyActive }: TopBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Code2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Code Translator
          </h1>
          <p className="text-xs text-muted-foreground">
            Instantly translate code between languages
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant={historyActive ? 'default' : 'outline'}
          size="sm"
          onClick={onHistory}
          title="Show translation history"
        >
          <History className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">History</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onHelp}
          title="Show help and tips"
        >
          <BookOpen className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Help</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSettings}
          title="Open settings"
        >
          <Settings className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Settings</span>
        </Button>
      </div>
    </div>
  )
}
