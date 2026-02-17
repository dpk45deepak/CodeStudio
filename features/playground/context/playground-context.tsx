"use client";

import { createContext, useContext, ReactNode } from "react";
import type { TemplateFile } from "../libs/path-to-json";

interface PlaygroundContextType {
  playgroundData: any;
  activeFileId: string | null;
  openFiles: (TemplateFile & { id: string; hasUnsavedChanges: boolean; content: string; originalContent: string })[];
  handleSave: () => Promise<void>;
  handleSaveAll: () => Promise<void>;
  isAISuggestionsEnabled: boolean;
  setIsAISuggestionsEnabled: (enabled: boolean) => void;
  setIsPreviewVisible: (visible: boolean) => void;
  setIsTerminalVisible: (visible: boolean) => void;
  isPreviewVisible: boolean;
  isTerminalVisible: boolean;
  error: string | null;
  loadingStep: number;
  templateData: any;
  fetchPlaygroundData: () => Promise<void>;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
}

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  // This is a placeholder implementation
  // In a real implementation, this would be provided by the parent component
  // For now, we'll provide default values to prevent crashes
  const contextValue: PlaygroundContextType = {
    playgroundData: null,
    activeFileId: null,
    openFiles: [],
    handleSave: async () => {},
    handleSaveAll: async () => {},
    isAISuggestionsEnabled: false,
    setIsAISuggestionsEnabled: () => {},
    setIsPreviewVisible: () => {},
    setIsTerminalVisible: () => {},
    isPreviewVisible: true,
    isTerminalVisible: false,
    error: null,
    loadingStep: 0,
    templateData: null,
    fetchPlaygroundData: async () => {},
  };

  return (
    <PlaygroundContext.Provider value={contextValue}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export default PlaygroundContext;
