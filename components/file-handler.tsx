'use client'

import React from "react"

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download, Share2 } from 'lucide-react'

interface FileHandlerProps {
  onFileUpload: (content: string, filename: string) => void
  onExport: (content: string, filename: string) => void
  translatedCode: string
  targetLanguage: string
}

const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    java: 'java',
    cpp: 'cpp',
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    r: 'r',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
  }
  return extensions[language] || 'txt'
}

export function FileHandler({
  onFileUpload,
  onExport,
  translatedCode,
  targetLanguage,
}: FileHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const content = await file.text()
    onFileUpload(content, file.name)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const exportAsFile = () => {
    const extension = getFileExtension(targetLanguage)
    onExport(translatedCode, `translated.${extension}`)
  }

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translated Code',
          text: translatedCode,
        })
      } catch (err) {
        // User cancelled share
      }
    }
  }

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".py,.js,.ts,.java,.cpp,.cs,.go,.rs,.r,.php,.rb,.swift,.txt"
      />

      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        title="Upload code file"
      >
        <Upload className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Upload</span>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={exportAsFile}
        disabled={!translatedCode}
        title="Download translated code"
      >
        <Download className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Download</span>
      </Button>

      {navigator.share && (
        <Button
          size="sm"
          variant="outline"
          onClick={shareCode}
          disabled={!translatedCode}
          title="Share translated code"
        >
          <Share2 className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Share</span>
        </Button>
      )}
    </div>
  )
}
