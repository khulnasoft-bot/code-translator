'use client'

import { buildAST, type SupportedLanguage } from '@/lib/transformer'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'

interface ASTVisualizerProps {
  code: string
  language: string
}

export function ASTVisualizer({ code, language }: ASTVisualizerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const ast = useMemo(
    () => buildAST(code, (language.toLowerCase() as SupportedLanguage) || 'javascript'),
    [code, language]
  )

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      function: 'text-blue-400',
      class: 'text-purple-400',
      if: 'text-yellow-400',
      for: 'text-green-400',
      while: 'text-green-400',
      import: 'text-orange-400',
      variable: 'text-cyan-400',
      statement: 'text-gray-400',
      comment: 'text-green-600',
      block: 'text-pink-400',
    }
    return colors[type] || 'text-gray-400'
  }

  const renderNode = (node: any, depth = 0, parentId = 'root') => {
    const nodeId = `${parentId}-${depth}-${node.name || node.type}`
    const isExpanded = expanded.has(nodeId)
    const indent = depth * 16

    return (
      <div key={nodeId}>
        <div
          className="flex cursor-pointer items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded transition-colors"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => toggleExpanded(nodeId)}
        >
          {node.children && node.children.length > 0 ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
          <span className={`text-xs font-mono font-semibold ${getTypeColor(node.type)}`}>
            {node.type}
          </span>
          {node.name && (
            <span className="text-xs font-mono text-primary">
              {node.name}
            </span>
          )}
          <span className="text-xs text-muted-foreground/50 ml-auto">
            L{node.lineStart + 1}-{node.lineEnd + 1}
          </span>
        </div>

        {isExpanded &&
          node.children &&
          node.children.length > 0 &&
          node.children.map((child: any, idx: number) =>
            renderNode(child, depth + 1, `${nodeId}-${idx}`)
          )}
      </div>
    )
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  return (
    <div className="flex-1 overflow-auto bg-code-bg p-4 text-sm font-mono">
      {ast.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-8">
          No code structure detected
        </div>
      ) : (
        <div className="space-y-px">{ast.map((node, idx) => renderNode(node, 0, `root-${idx}`))}</div>
      )}
    </div>
  )
}
