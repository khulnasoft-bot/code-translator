'use client'

import { useState, useCallback } from 'react'
import { transformCode, detectLanguage } from '@/lib/transformer'
import { FileManager, TranslationFile } from './file-manager'
import { CodeEditor } from './code-editor'
import { LanguageSelector } from './language-selector'
import { DiffViewer } from './diff-viewer'
import { ASTVisualizer } from './ast-visualizer'
import { Button } from '@/components/ui/button'
import { Copy, Download, Zap, GitCompare, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

// Simple UUID generator for client-side use
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function MultiFileTranslator() {
  const [files, setFiles] = useState<TranslationFile[]>([
    {
      id: generateId(),
      name: 'example.py',
      language: 'python',
      content: `def greet(name):
    print(f"Hello, {name}!")
    
if __name__ == "__main__":
    greet("World")`,
    },
  ])

  const [activeFileId, setActiveFileId] = useState(files[0].id)
  const [targetLanguage, setTargetLanguage] = useState('javascript')
  const [showDiff, setShowDiff] = useState(false)
  const [showAST, setShowAST] = useState(false)
  const [viewMode, setViewMode] = useState<'code' | 'diff' | 'ast'>('code')

  const activeFile = files.find((f) => f.id === activeFileId) || files[0]

  // Translate code
  const handleTranslate = useCallback(() => {
    const sourceLanguage = detectLanguage(activeFile.content)
    const result = transformCode(activeFile.content, sourceLanguage, targetLanguage)

    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId
          ? {
              ...f,
              translatedContent: result.code,
              targetLanguage,
            }
          : f
      )
    )
  }, [activeFile, activeFileId, targetLanguage])

  // Translate all files
  const handleTranslateAll = useCallback(() => {
    setFiles((prev) =>
      prev.map((f) => {
        const sourceLanguage = detectLanguage(f.content)
        const result = transformCode(f.content, sourceLanguage, targetLanguage)
        return {
          ...f,
          translatedContent: result.code,
          targetLanguage,
        }
      })
    )
  }, [targetLanguage])

  // Add new file
  const handleAddFile = useCallback(() => {
    const newFile: TranslationFile = {
      id: generateId(),
      name: `file${files.length + 1}.${getExtension(activeFile.language)}`,
      language: activeFile.language,
      content: '',
    }
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }, [activeFile, files])

  // Remove file
  const handleRemoveFile = useCallback((id: string) => {
    if (files.length === 1) return
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (activeFileId === id) {
      setActiveFileId(files[0].id)
    }
  }, [activeFileId, files])

  // Export all files as ZIP
  const handleExportZip = useCallback(async () => {
    try {
      // Dynamic import to avoid issues
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      for (const file of files) {
        if (file.translatedContent) {
          const ext = getExtension(targetLanguage)
          zip.file(
            `translated-${file.name.replace(/\.\w+$/, `.${ext}`)}}`,
            file.translatedContent
          )
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'translated-code.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }, [files, targetLanguage])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Code Translator
          </h1>
          <div className="flex gap-2">
            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
            />
            <Button
              onClick={handleTranslateAll}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Translate All
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Manager */}
        <FileManager
          files={files}
          activeFileId={activeFileId}
          onFileSelect={setActiveFileId}
          onFileAdd={handleAddFile}
          onFileRemove={handleRemoveFile}
          onExportAll={handleExportZip}
        />

        {/* Editor Area */}
        <div className="flex flex-1 gap-px overflow-hidden bg-border">
          {/* Source Code */}
          <div className="flex flex-1 flex-col overflow-hidden bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">
                {activeFile.name}
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(activeFile.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <CodeEditor
              value={activeFile.content}
              onChange={(value) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === activeFileId ? { ...f, content: value } : f
                  )
                )
              }}
              language={activeFile.language}
              className="flex-1"
            />
          </div>

          {/* Translated Code / Diff / AST */}
          <div className="flex flex-1 flex-col overflow-hidden bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'code' ? 'default' : 'outline'}
                  onClick={() => setViewMode('code')}
                >
                  Code
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'diff' ? 'default' : 'outline'}
                  onClick={() => setViewMode('diff')}
                  disabled={!activeFile.translatedContent}
                >
                  <GitCompare className="h-4 w-4" />
                  Diff
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'ast' ? 'default' : 'outline'}
                  onClick={() => setViewMode('ast')}
                >
                  <BarChart3 className="h-4 w-4" />
                  AST
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleTranslate}
                  title="Translate current file"
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(activeFile.translatedContent || '')
                  }
                  disabled={!activeFile.translatedContent}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const element = document.createElement('a')
                    element.setAttribute(
                      'href',
                      'data:text/plain;charset=utf-8,' +
                        encodeURIComponent(
                          activeFile.translatedContent || ''
                        )
                    )
                    element.setAttribute(
                      'download',
                      `${activeFile.name}.${getExtension(targetLanguage)}`
                    )
                    element.style.display = 'none'
                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                  disabled={!activeFile.translatedContent}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            {viewMode === 'code' && (
              <CodeEditor
                value={activeFile.translatedContent || ''}
                onChange={() => {}}
                language={targetLanguage}
                readOnly
                className="flex-1"
              />
            )}

            {viewMode === 'diff' && activeFile.translatedContent && (
              <DiffViewer
                sourceCode={activeFile.content}
                translatedCode={activeFile.translatedContent}
                className="flex-1"
              />
            )}

            {viewMode === 'ast' && (
              <ASTVisualizer
                code={activeFile.translatedContent || activeFile.content}
                language={
                  viewMode === 'ast' && activeFile.translatedContent
                    ? targetLanguage
                    : activeFile.language
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    java: 'java',
    cpp: 'cpp',
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
  }
  return extensions[language] || 'txt'
}
