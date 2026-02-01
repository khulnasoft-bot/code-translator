'use client'

import { useEffect, useState } from 'react'
import { X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [autoFormat, setAutoFormat] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState('sm')

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('code-translator-settings')
    if (stored) {
      try {
        const settings = JSON.parse(stored)
        setTheme(settings.theme || 'dark')
        setAutoFormat(settings.autoFormat !== false)
        setShowLineNumbers(settings.showLineNumbers !== false)
        setFontSize(settings.fontSize || 'sm')
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [])

  const saveSettings = (
    newTheme?: string,
    newAutoFormat?: boolean,
    newShowLineNumbers?: boolean,
    newFontSize?: string
  ) => {
    const settings = {
      theme: newTheme || theme,
      autoFormat: newAutoFormat !== undefined ? newAutoFormat : autoFormat,
      showLineNumbers:
        newShowLineNumbers !== undefined ? newShowLineNumbers : showLineNumbers,
      fontSize: newFontSize || fontSize,
    }
    localStorage.setItem(
      'code-translator-settings',
      JSON.stringify(settings)
    )

    if (newTheme) {
      setTheme(newTheme as 'light' | 'dark')
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    if (newAutoFormat !== undefined) setAutoFormat(newAutoFormat)
    if (newShowLineNumbers !== undefined) setShowLineNumbers(newShowLineNumbers)
    if (newFontSize) setFontSize(newFontSize)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-card p-6 text-foreground shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Settings</h2>
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
          {/* Theme Setting */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Theme</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => saveSettings('dark')}
                className="flex-1 gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                size="sm"
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => saveSettings('light')}
                className="flex-1 gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Font Size</h3>
            <div className="space-y-2">
              {['xs', 'sm', 'md', 'lg'].map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="font-size"
                    value={size}
                    checked={fontSize === size}
                    onChange={(e) => saveSettings(undefined, undefined, undefined, e.target.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm capitalize text-muted-foreground">
                    {size === 'xs' ? 'Extra Small' : size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Display</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => saveSettings(undefined, undefined, e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm text-muted-foreground">Show line numbers</span>
              </label>
            </div>
          </div>

          {/* Translation Options */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Translation</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFormat}
                  onChange={(e) => saveSettings(undefined, e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm text-muted-foreground">Auto-format translated code</span>
              </label>
            </div>
          </div>

          {/* About */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Code Translator</strong> v1.0 • Powered by AI
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              Translate code between 12+ programming languages instantly
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
