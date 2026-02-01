'use client'

import { Button } from "@/components/ui/button"
import { HelpModal } from '@/components/help-modal'
import { SettingsPanel } from '@/components/settings-panel'
import { TopBar } from '@/components/top-bar'
import { SessionHistory } from '@/components/session-history'
import { LanguageSelector } from '@/components/language-selector'
import { FileHandler } from '@/components/file-handler'
import { Copy } from '@/components/icons/copy'
import { GitCompare } from '@/components/icons/git-compare'
import { Download } from '@/components/icons/download'
import { Zap } from '@/components/icons/zap'
import { DiffViewer } from '@/components/diff-viewer'
import { CodeEditor } from '@/components/code-editor'
import { SAMPLE_PYTHON } from '@/constants/sample-python'

import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"

import { MultiFileTranslator } from '@/components/multi-file-translator'

export default function Home() {
  return <MultiFileTranslator />
}
