'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, TrendingUp } from 'lucide-react'

interface TransformationStatistics {
  functionsDetected: number
  classesDetected: number
  importsDetected: number
  linesTransformed: number
  mixedLanguageDetected: boolean
  normalizationApplied: boolean
}

interface TransformationStatsProps {
  stats: TransformationStatistics
  warnings: string[]
  totalLines: number
  className?: string
}

export function TransformationStats({
  stats,
  warnings,
  totalLines,
  className,
}: TransformationStatsProps) {
  const transformationPercentage = totalLines > 0 ? Math.round((stats.linesTransformed / totalLines) * 100) : 0

  const statItems = [
    {
      label: 'Functions',
      value: stats.functionsDetected,
      icon: 'Σ',
      color: 'text-blue-400',
    },
    {
      label: 'Classes',
      value: stats.classesDetected,
      icon: '◊',
      color: 'text-purple-400',
    },
    {
      label: 'Imports',
      value: stats.importsDetected,
      icon: '↓',
      color: 'text-orange-400',
    },
    {
      label: 'Transformed',
      value: `${transformationPercentage}%`,
      icon: '✓',
      color: 'text-green-400',
    },
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statItems.map((stat, idx) => (
          <Card
            key={idx}
            className="border border-border/50 bg-card/30 p-3 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={cn('text-xs text-muted-foreground', stat.color)}>
                  {stat.label}
                </div>
                <div className={cn('text-lg font-bold', stat.color)}>
                  {stat.value}
                </div>
              </div>
              <div className={cn('text-lg opacity-50', stat.color)}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {stats.mixedLanguageDetected && (
          <div className="flex items-center gap-1 rounded-full bg-yellow-950/30 px-2 py-1 text-xs text-yellow-400 border border-yellow-700/30">
            <AlertCircle className="h-3 w-3" />
            <span>Mixed Languages Detected</span>
          </div>
        )}

        {stats.normalizationApplied && (
          <div className="flex items-center gap-1 rounded-full bg-blue-950/30 px-2 py-1 text-xs text-blue-400 border border-blue-700/30">
            <Info className="h-3 w-3" />
            <span>Code Normalized</span>
          </div>
        )}

        {warnings.length === 0 && (
          <div className="flex items-center gap-1 rounded-full bg-green-950/30 px-2 py-1 text-xs text-green-400 border border-green-700/30">
            <CheckCircle2 className="h-3 w-3" />
            <span>No Issues</span>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-950/30 px-2 py-1 text-xs text-orange-400 border border-orange-700/30">
            <AlertCircle className="h-3 w-3" />
            <span>{warnings.length} Warning{warnings.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Warnings List */}
      {warnings.length > 0 && (
        <Card className="border border-orange-700/30 bg-orange-950/10 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
              <AlertCircle className="h-3 w-3" />
              <span>Transformation Warnings</span>
            </div>
            <ul className="space-y-1">
              {warnings.slice(0, 5).map((warning, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-orange-400/80"
                >
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  <span>{warning}</span>
                </li>
              ))}
              {warnings.length > 5 && (
                <li className="text-xs text-orange-400/60 italic">
                  ... and {warnings.length - 5} more
                </li>
              )}
            </ul>
          </div>
        </Card>
      )}

      {/* Quality Indicator */}
      <Card className="border border-border/50 bg-card/30 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Conversion Quality
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors',
                  i <= Math.ceil((100 - warnings.length * 10) / 20)
                    ? 'bg-green-400'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
