'use client'

import { useState, useRef } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { platforms } from '@/lib/featureData'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, CheckCircle2, AlertTriangle, Paperclip, FileText, X, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'loading' | 'success' | 'error'

export function AIAnalyzer() {
  const [description, setDescription] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [state, setState] = useState<AnalysisState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successCount, setSuccessCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { selectPlatform, clearAllFeaturesAndAddOns, toggleFeatureById, toggleAddOnById } = useProjectStore()

  const canSubmit = (description.trim().length >= 20 || pdfFile !== null) && state !== 'loading'

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are supported.')
      setState('error')
      return
    }
    setPdfFile(file)
    setDescription('')  // clear text input when PDF is selected
    setState('idle')
    setErrorMessage('')
  }

  const handleRemovePDF = () => {
    setPdfFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setState('idle')
  }

  const handleAnalyze = async () => {
    setState('loading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      if (pdfFile) {
        formData.append('pdf', pdfFile)
      } else {
        formData.append('description', description.trim())
      }

      const res = await fetch('/api/analyze-project', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMessage(data.message ?? 'Something went wrong. Please try again.')
        setState('error')
        return
      }

      // Apply results to Zustand store
      const { platform, features, addOns } = data.result

      // Select platform
      const matchedPlatform = platforms.find(p => p.id === platform)
      if (matchedPlatform) selectPlatform(matchedPlatform)

      clearAllFeaturesAndAddOns()  // clear previous selections first
      
      // Select features 
      features.forEach((id: string) => toggleFeatureById(id))
      // Select AddOns
      if (addOns) {
        addOns.forEach((id: string) => toggleAddOnById(id))
      }

      setSuccessCount(features.length + (addOns ? addOns.length : 0))
      setState('success')

    } catch {
      setErrorMessage('Network error. Please check your connection and try again.')
      setState('error')
    }
  }

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> AI PROJECT ANALYZER
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Describe your project or upload a brief — the AI will configure the calculator for you.
            </p>
          </div>

          {state === 'success' && (
            <div className="p-3 bg-green-500/10 text-green-600 rounded-md text-sm border border-green-500/20 flex gap-2 items-start">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Done</strong> — {successCount} features selected based on your description.<br />
                Review the selections below and adjust as needed.
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20 flex gap-2 items-center">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <textarea
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. I want to build a food delivery app where customers can browse restaurants, place orders, track drivers in real time, and pay online..."
            value={description}
            onChange={e => {
              setDescription(e.target.value)
              if (state !== 'idle') setState('idle')
            }}
            disabled={pdfFile !== null || state === 'loading'}
            rows={4}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                style={{ display: 'none' }}
                id="pdf-upload-input"
              />
              {!pdfFile ? (
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Paperclip className="w-4 h-4" /> Upload PDF
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-background border px-3 py-2 rounded-md text-sm w-full sm:w-auto">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{pdfFile.name}</span>
                  <button onClick={handleRemovePDF} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {state === 'loading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" /> Analyze & Configure
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
