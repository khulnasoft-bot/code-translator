'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, X, Download } from 'lucide-react'

export interface TranslationFile {
  id: string
  name: string
  language: string
  content: string
  translatedContent?: string
  targetLanguage?: string
}

interface FileManagerProps {
  files: TranslationFile[]
  activeFileId: string
  onFileSelect: (id: string) => void
  onFileAdd: () => void
  onFileRemove: (id: string) => void
  onExportAll: () => void
}

export function FileManager({
  files,
  activeFileId,
  onFileSelect,
  onFileAdd,
  onFileRemove,
  onExportAll,
}: FileManagerProps) {
  return (
    <div className="flex flex-col border-r border-border bg-card/30 w-64">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Files</h2>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onFileAdd}
            title="Add new file"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onExportAll}
            title="Export all files as zip"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-xs text-muted-foreground text-center">
              No files yet. Click + to add.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  'flex items-center gap-2 rounded px-3 py-2 cursor-pointer group text-xs transition-colors',
                  activeFileId === file.id
                    ? 'bg-primary/20 text-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <div
                  className="flex-1 truncate"
                  onClick={() => onFileSelect(file.id)}
                  title={file.name}
                >
                  {file.name}
                  <span className="text-xs opacity-60 ml-1">
                    ({file.language})
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileRemove(file.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
