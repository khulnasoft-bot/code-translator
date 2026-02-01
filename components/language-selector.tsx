'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
}

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'r', name: 'R' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'swift', name: 'Swift' },
]

export function LanguageSelector({
  value,
  onChange,
}: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 border-border bg-secondary text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-border bg-card">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
