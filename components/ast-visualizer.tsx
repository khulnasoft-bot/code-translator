'use client'

import { parseToAST } from '@/lib/transformer'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ASTVisualizerProps {
  code: string
  language: string
}

export function ASTVisualizer({ code, language }: ASTVisualizerProps) {
  const ast = parseToAST(code, language)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const renderNode = (node: any, depth = 0, parentId = 'root') => {
    const nodeId = `${parentId}-${depth}-${node.name || node.type}`
    const isExpanded = expanded.has(nodeId)

    const indent = depth * 16

    return (
      <div key={nodeId}>
        <div
          className="flex cursor-pointer items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => toggleExpanded(nodeId)}
        >
          {node.children && node.children.length > 0 ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {node.type}
          </span>
          {node.name && (
            <span className="text-xs font-mono text-primary font-semibold">
              {node.name}
            </span>
          )}
          <span className="text-xs text-muted-foreground/50">
            [{node.lineStart}-{node.lineEnd}]
          </span>
        </div>

        {isExpanded &&
          node.children &&
          node.children.map((child: any) =>
            renderNode(child, depth + 1, nodeId)
          )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-code-bg p-4 text-sm font-mono">
      <div className="space-y-1">{renderNode(ast)}</div>
    </div>
  )
}
