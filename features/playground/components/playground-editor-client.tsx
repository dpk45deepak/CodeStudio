"use client";
import React from 'react'
import { PlaygroundEditor } from './playground-editor'
import type { TemplateItem, TemplateFile } from '@/features/playground/libs/path-to-json'
import { useFileExplorer } from '@/features/playground/hooks/useFileExplorer'
import { usePlayground } from '@/features/playground/hooks/usePlayground'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface PlaygroundEditorClientProps {
  templateData: TemplateItem
}

const PlaygroundEditorClient: React.FC<PlaygroundEditorClientProps> = ({ templateData }) => {
  const { id } = useParams<{ id: string }>()
  
  // Use the existing hooks for proper file management
  const { saveTemplateData } = usePlayground(id!)
  const {
    activeFileId,
    openFiles,
    openFile,
    closeFile,
    updateFileContent,
    setTemplateData,
    setPlaygroundId,
  } = useFileExplorer()

  // Set playground ID when component mounts
  React.useEffect(() => {
    if (id) {
      setPlaygroundId(id)
    }
  }, [id, setPlaygroundId])

  // Initialize template data when it loads
  React.useEffect(() => {
    if (templateData && 'folderName' in templateData) {
      setTemplateData(templateData)
    }
  }, [templateData, setTemplateData])

  const [suggestion, setSuggestion] = React.useState<string | null>(null)
  const [suggestionLoading, setSuggestionLoading] = React.useState(false)
  const [suggestionPosition, setSuggestionPosition] = React.useState<{ line: number; column: number } | null>(null)

  // Get the active file from open files
  const activeFile = openFiles.find((file) => file.id === activeFileId)

  const handleSave = async (file: TemplateItem, content: string) => {
    if (!('filename' in file) || !('fileExtension' in file)) {
      toast.error('Invalid file type for saving')
      return
    }

    try {
      // Update the file content in the useFileExplorer state
      updateFileContent(activeFileId!, content)
      
      // Get the latest template data and update the file content
      const currentTemplateData = useFileExplorer.getState().templateData
      if (!currentTemplateData) {
        toast.error('No template data available')
        return
      }

      // Create a deep copy of template data
      const updatedTemplateData = JSON.parse(JSON.stringify(currentTemplateData))
      
      // Function to recursively update file content
      const updateFileInTemplate = (items: any[]): any[] => {
        return items.map((item) => {
          if ('folderName' in item) {
            return { ...item, items: updateFileInTemplate(item.items) }
          } else if (
            'filename' in item &&
            item.filename === file.filename &&
            item.fileExtension === file.fileExtension
          ) {
            return { ...item, content }
          }
          return item
        })
      }

      updatedTemplateData.items = updateFileInTemplate(updatedTemplateData.items)

      // Save to database
      await saveTemplateData(updatedTemplateData)
      
      // Update the template data in the hook
      setTemplateData(updatedTemplateData)

      toast.success(`Saved ${file.filename}.${file.fileExtension}`)
    } catch (error) {
      console.error('Error saving file:', error)
      toast.error(`Failed to save ${file.filename}.${file.fileExtension}`)
    }
  }

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges)

    if (unsavedFiles.length === 0) {
      toast.info('No unsaved changes')
      return
    }

    try {
      // Get current template data
      const currentTemplateData = useFileExplorer.getState().templateData
      if (!currentTemplateData) {
        toast.error('No template data available')
        return
      }

      // Create a deep copy
      const updatedTemplateData = JSON.parse(JSON.stringify(currentTemplateData))

      // Update all unsaved files
      const updateFilesInTemplate = (items: any[]): any[] => {
        return items.map((item) => {
          if ('folderName' in item) {
            return { ...item, items: updateFilesInTemplate(item.items) }
          } else if ('filename' in item) {
            const unsavedFile = unsavedFiles.find(
              (f) => f.filename === item.filename && f.fileExtension === item.fileExtension
            )
            if (unsavedFile) {
              return { ...item, content: unsavedFile.content }
            }
          }
          return item
        })
      }

      updatedTemplateData.items = updateFilesInTemplate(updatedTemplateData.items)

      // Save to database
      await saveTemplateData(updatedTemplateData)
      
      // Update template data and reset unsaved changes
      setTemplateData(updatedTemplateData)
      
      // Update open files to mark as saved
      const updatedOpenFiles = openFiles.map((f) =>
        unsavedFiles.find((uf) => uf.id === f.id)
          ? { ...f, originalContent: f.content, hasUnsavedChanges: false }
          : f
      )
      useFileExplorer.getState().setOpenFiles(updatedOpenFiles)

      toast.success(`Saved ${unsavedFiles.length} file(s)`)
    } catch (error) {
      console.error('Error saving files:', error)
      toast.error('Failed to save some files')
    }
  }

  const handleContentChange = (value: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value)
    }
  }

  const handleAcceptSuggestion = (editor: any, monaco: any) => {
    // Clear the suggestion after acceptance
    setSuggestion(null)
    setSuggestionPosition(null)
    console.log('Suggestion accepted')
  }

  const handleRejectSuggestion = (editor: any) => {
    // Clear the suggestion when rejected
    setSuggestion(null)
    setSuggestionPosition(null)
    console.log('Suggestion rejected')
  }

  const handleTriggerSuggestion = (type: string, editor: any) => {
    // Mock suggestion trigger - in real implementation, this would call an AI service
    console.log('Triggering suggestion:', type)
    
    // Get current cursor position
    const position = editor.getPosition()
    if (position) {
      setSuggestionPosition({ line: position.lineNumber, column: position.column })
      setSuggestionLoading(true)
      
      // Simulate AI response delay
      setTimeout(() => {
        setSuggestion('// AI generated suggestion')
        setSuggestionLoading(false)
      }, 1000)
    }
  }

  // Add keyboard shortcuts for save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (activeFile) {
          handleSave(activeFile, activeFile.content)
        }
      } else if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault()
        handleSaveAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeFile, handleSave, handleSaveAll])

  return (
    <div className="h-screen">
      <PlaygroundEditor 
        activeFile={activeFile}
        content={activeFile?.content || ''}
        onContentChange={handleContentChange}
        suggestion={suggestion}
        suggestionLoading={suggestionLoading}
        suggestionPosition={suggestionPosition}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectSuggestion={handleRejectSuggestion}
        onTriggerSuggestion={handleTriggerSuggestion}
        templateData={templateData} 
        onSave={handleSave}
        onSaveAll={handleSaveAll}
      />
    </div>
  )
}

export default PlaygroundEditorClient