'use client'

import React from "react"

import { useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { highlightCode } from './syntax-highlighter'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  readOnly?: boolean
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  const tokens = useMemo(() => highlightCode(value, language), [value, language])

  const handleScroll = () => {
    if (editorRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const lineNumbers = useMemo(() => {
    return value.split('\n').map((_, i) => i + 1)
  }, [value])

  return (
    <div className={cn('relative flex w-full overflow-hidden', className)}>
      {/* Line Numbers */}
      <div className="select-none border-r border-border bg-code-line px-3 py-4 text-right font-mono text-xs text-muted-foreground">
        <div ref={lineNumbersRef} className="overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed">
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative flex-1 overflow-hidden">
        {/* Highlight Layer */}
        <div
          ref={highlightRef}
          className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words bg-code-bg p-4 font-mono text-sm leading-relaxed"
        >
          {tokens.map((token, i) => (
            <span key={i} className={token.class}>
              {token.text}
            </span>
          ))}
        </div>

        {/* Text Input Layer */}
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck="false"
          className="relative z-10 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground caret-primary outline-none"
          style={{
            color: 'rgba(148, 163, 184, 0)',
            backgroundColor: 'transparent',
            caretColor: 'rgb(139, 92, 246)',
          }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 bg-gradient-to-tl from-code-bg to-transparent" />
    </div>
  )
}
