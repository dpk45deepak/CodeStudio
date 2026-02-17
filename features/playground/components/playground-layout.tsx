"use client"

import { usePlayground } from "../context/playground-context"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingStep from "@/components/ui/loader"
import { PlaygroundEditor } from "./playground-editor"
import { PlaygroundHeader } from "./playground-header"

export function PlaygroundLayout() {
  const { 
    error, 
    loadingStep, 
    templateData, 
    fetchPlaygroundData,
    activeFileId,
    openFiles,
    handleSave,
    handleSaveAll
  } = usePlayground()

  // Find the active file
  const activeFile = openFiles.find(file => file.id === activeFileId)
  
  // Mock props for now - these should come from the actual context implementation
  const mockProps = {
    suggestion: null,
    suggestionLoading: false,
    suggestionPosition: null,
    onAcceptSuggestion: () => {},
    onRejectSuggestion: () => {},
    onTriggerSuggestion: () => {},
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gray-950">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-red-300 mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button onClick={fetchPlaygroundData} variant="destructive">
          Try Again
        </Button>
      </div>
    )
  }

  if (loadingStep < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gray-950">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border bg-gray-900 border-gray-800">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-100">Loading Playground</h2>
          <div className="mb-8">
            <LoadingStep currentStep={loadingStep} step={1} label="Loading playground metadata" />
            <LoadingStep currentStep={loadingStep} step={2} label="Loading template structure" />
            <LoadingStep currentStep={loadingStep} step={3} label="Ready to explore" />
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${(loadingStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-gray-950">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Loading template data...</h2>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <PlaygroundHeader />
      <PlaygroundEditor
        activeFile={activeFile}
        content={activeFile?.content || ""}
        onContentChange={(value) => {
          // This should update the file content in context
          console.log("Content changed:", value)
        }}
        suggestion={mockProps.suggestion}
        suggestionLoading={mockProps.suggestionLoading}
        suggestionPosition={mockProps.suggestionPosition}
        onAcceptSuggestion={mockProps.onAcceptSuggestion}
        onRejectSuggestion={mockProps.onRejectSuggestion}
        onTriggerSuggestion={mockProps.onTriggerSuggestion}
        templateData={templateData}
        onSave={async (file, content) => {
          // This should save the file
          if ('filename' in file) {
            console.log("Saving file:", file.filename)
          } else {
            console.log("Saving folder:", file.folderName)
          }
        }}
        onSaveAll={handleSaveAll}
      />
    </div>
  )
}