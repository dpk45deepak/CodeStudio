"use client";

import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";
import type {
    TemplateFile,
    TemplateItem,
} from "@/features/playground/libs/path-to-json";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
    FileText,
    FolderOpen,
    AlertCircle,
    Save,
    X,
    Settings,
    Code2,
    Globe,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import WebContainerPreview from "@/features/webcontainers/components/webcontainer-preveiw";
import LoadingStep from "@/components/ui/loader";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";
import ToggleAI from "@/features/playground/components/toggle-ai";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useAISuggestions } from "@/features/playground/hooks/useAISuggestion";
import { useWebContainer } from "@/features/webcontainers/hooks/useWebContainer";
import { TemplateFolder } from "@/features/playground/types";
import { findFilePath } from "@/features/playground/libs";
import { ConfirmationDialog } from "@/features/playground/components/dialogs/conformation-dialog";

const MainPlaygroundPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // UI state
    const [confirmationDialog, setConfirmationDialog] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: () => {},
        onCancel: () => {},
    });

    const [isPreviewVisible, setIsPreviewVisible] = useState(true);
    const [isFileTreeVisible, setIsFileTreeVisible] = useState(true);

    // Custom hooks
    const { playgroundData, templateData, isLoading, error, saveTemplateData } =
        usePlayground(id);
    const aiSuggestions = useAISuggestions();
    const {
        activeFileId,
        closeAllFiles,
        openFile,
        closeFile,
        updateFileContent,
        handleAddFile,
        handleAddFolder,
        handleDeleteFile,
        handleDeleteFolder,
        handleRenameFile,
        handleRenameFolder,
        openFiles,
        setTemplateData,
        setActiveFileId,
        setPlaygroundId,
        setOpenFiles,
    } = useFileExplorer();

    const {
        serverUrl,
        isLoading: containerLoading,
        error: containerError,
        instance,
        writeFileSync,
        // @ts-expect-error - WebContainer instance type is not fully typed
    } = useWebContainer({ templateData });

    const lastSyncedContent = useRef<Map<string, string>>(new Map());

    // Set template data when playground loads
    React.useEffect(() => {
        setPlaygroundId(id);
    }, [id, setPlaygroundId]);

    // Initialize zustand templateData from usePlayground only on first load
    React.useEffect(() => {
        if (templateData && !openFiles.length) {
            setTemplateData(templateData);
        }
    }, [templateData, setTemplateData, openFiles.length]);

    // Create wrapper functions that pass saveTemplateData
    const wrappedHandleAddFile = useCallback(
        (newFile: TemplateFile, parentPath: string) => {
            return handleAddFile(
                newFile,
                parentPath,
                writeFileSync!,
                instance,
                saveTemplateData,
            );
        },
        [handleAddFile, writeFileSync, instance, saveTemplateData],
    );

    const wrappedHandleAddFolder = useCallback(
        (newFolder: TemplateFolder, parentPath: string) => {
            return handleAddFolder(
                newFolder,
                parentPath,
                instance,
                saveTemplateData,
            );
        },
        [handleAddFolder, instance, saveTemplateData],
    );

    const wrappedHandleDeleteFile = useCallback(
        (file: TemplateFile, parentPath: string) => {
            return handleDeleteFile(file, parentPath, saveTemplateData);
        },
        [handleDeleteFile, saveTemplateData],
    );

    const wrappedHandleDeleteFolder = useCallback(
        (folder: TemplateFolder, parentPath: string) => {
            return handleDeleteFolder(folder, parentPath, saveTemplateData);
        },
        [handleDeleteFolder, saveTemplateData],
    );

    const wrappedHandleRenameFile = useCallback(
        (
            file: TemplateFile,
            newFilename: string,
            newExtension: string,
            parentPath: string,
        ) => {
            return handleRenameFile(
                file,
                newFilename,
                newExtension,
                parentPath,
                saveTemplateData,
            );
        },
        [handleRenameFile, saveTemplateData],
    );

    const wrappedHandleRenameFolder = useCallback(
        (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
            return handleRenameFolder(
                folder,
                newFolderName,
                parentPath,
                saveTemplateData,
            );
        },
        [handleRenameFolder, saveTemplateData],
    );

    const activeFile = openFiles.find((file) => file.id === activeFileId);
    const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

    const handleFileSelect = (file: TemplateFile) => {
        openFile(file);
    };

    const handleSave = useCallback(
        async (fileId?: string) => {
            const targetFileId = fileId || activeFileId;
            if (!targetFileId) return;

            const fileToSave = openFiles.find((f) => f.id === targetFileId);
            if (!fileToSave) return;

            const latestTemplateData = useFileExplorer.getState().templateData;
            if (!latestTemplateData) return;

            try {
                const filePath = findFilePath(fileToSave, latestTemplateData);
                if (!filePath) {
                    toast.error(
                        `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`,
                    );
                    return;
                }

                // Update file content in template data (clone for immutability)
                const updatedTemplateData = JSON.parse(
                    JSON.stringify(latestTemplateData),
                );
                const updateFileContent = (
                    items: (TemplateFile | TemplateFolder)[],
                ): (TemplateFile | TemplateFolder)[] =>
                    items.map((item) => {
                        if ("folderName" in item) {
                            return {
                                ...item,
                                items: updateFileContent(item.items),
                            };
                        } else if (
                            item.filename === fileToSave.filename &&
                            item.fileExtension === fileToSave.fileExtension
                        ) {
                            return { ...item, content: fileToSave.content };
                        }
                        return item;
                    });
                updatedTemplateData.items = updateFileContent(
                    updatedTemplateData.items,
                );

                // Sync with WebContainer
                if (writeFileSync) {
                    await writeFileSync(filePath, fileToSave.content);
                    lastSyncedContent.current.set(
                        fileToSave.id,
                        fileToSave.content,
                    );
                    if (instance && instance.fs) {
                        await instance.fs.writeFile(
                            filePath,
                            fileToSave.content,
                        );
                    }
                }

                // Use saveTemplateData to persist changes
                await saveTemplateData(updatedTemplateData);
                setTemplateData(updatedTemplateData);

                // Update open files
                const updatedOpenFiles = openFiles.map((f) =>
                    f.id === targetFileId
                        ? {
                              ...f,
                              content: fileToSave.content,
                              originalContent: fileToSave.content,
                              hasUnsavedChanges: false,
                          }
                        : f,
                );
                setOpenFiles(updatedOpenFiles);

                toast.success(
                    `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`,
                );
            } catch (error) {
                console.error("Error saving file:", error);
                toast.error(
                    `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`,
                );
                throw error;
            }
        },
        [
            activeFileId,
            openFiles,
            writeFileSync,
            instance,
            saveTemplateData,
            setTemplateData,
            setOpenFiles,
        ],
    );

    // Wrapper function to match PlaygroundEditor save signature
    const handleSaveForEditor = useCallback(
        async (file: TemplateItem) => {
            if (!("filename" in file) || !("fileExtension" in file)) {
                toast.error("Invalid file type for saving");
                return;
            }

            // Find the corresponding open file
            const openFile = openFiles.find(
                (f) =>
                    f.filename === file.filename &&
                    f.fileExtension === file.fileExtension,
            );

            if (openFile) {
                await handleSave(openFile.id);
            }
        },
        [handleSave, openFiles],
    );

    const handleSaveAll = async () => {
        const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

        if (unsavedFiles.length === 0) {
            toast.info("No unsaved changes");
            return;
        }

        try {
            await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
            toast.success(`Saved ${unsavedFiles.length} file(s)`);
        } catch {
            toast.error("Failed to save some files");
        }
    };

    // Add event to save file by click ctrl + s
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave]);

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-slate-950">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                    <AlertCircle className="relative h-16 w-16 text-red-400 mb-6" />
                </div>
                <div className="relative bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-semibold text-slate-100 mb-3">
                        Something went wrong
                    </h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-slate-950">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Code2 className="h-4 w-4 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-100">
                                Loading Playground
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <LoadingStep
                                currentStep={1}
                                step={1}
                                label="Loading playground data"
                            />
                            <LoadingStep
                                currentStep={2}
                                step={2}
                                label="Setting up environment"
                            />
                            <LoadingStep
                                currentStep={3}
                                step={3}
                                label="Ready to code"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No template data
    if (!templateData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 bg-slate-950">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center">
                        <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="h-8 w-8 text-amber-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">
                            No template data available
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            This playground doesn&apos;t have any files yet. Try
                            reloading or creating a new playground.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Reload Template
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="relative flex h-[calc(100vh-4rem)] bg-slate-950">
                {/* Ambient Glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full" />
                </div>

                {/* File Tree Sidebar */}
                <div
                    className={`relative transition-all duration-300 ${isFileTreeVisible ? "w-72" : "w-0 overflow-hidden"}`}
                >
                    <div className="h-full bg-slate-900/50 border-r border-slate-800 backdrop-blur-sm">
                        <TemplateFileTree
                            data={templateData}
                            onFileSelect={handleFileSelect}
                            selectedFile={activeFile}
                            title="File Explorer"
                            onAddFile={wrappedHandleAddFile}
                            onAddFolder={wrappedHandleAddFolder}
                            onDeleteFile={wrappedHandleDeleteFile}
                            onDeleteFolder={wrappedHandleDeleteFolder}
                            onRenameFile={wrappedHandleRenameFile}
                            onRenameFolder={wrappedHandleRenameFolder}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <SidebarInset className="relative flex-1 min-w-0 bg-slate-950/50">
                    {/* Header */}
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-800/50 px-4 bg-slate-900/30 backdrop-blur-sm">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            onClick={() =>
                                setIsFileTreeVisible(!isFileTreeVisible)
                            }
                        >
                            {isFileTreeVisible ? (
                                <PanelLeftClose className="h-4 w-4" />
                            ) : (
                                <PanelLeftOpen className="h-4 w-4" />
                            )}
                        </Button>

                        <Separator
                            orientation="vertical"
                            className="h-6 bg-slate-800"
                        />

                        <div className="flex flex-1 items-center gap-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                                    <Code2 className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-sm font-medium text-slate-100 truncate">
                                        {playgroundData?.name ||
                                            "Code Playground"}
                                    </h1>
                                    <p className="text-xs text-slate-400 truncate">
                                        {openFiles.length} file
                                        {openFiles.length !== 1 ? "s" : ""} open
                                        {hasUnsavedChanges &&
                                            " • Unsaved changes"}
                                    </p>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-2 ml-auto">
                                {containerLoading && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                                            Building
                                        </span>
                                    </div>
                                )}
                                {serverUrl && !containerLoading && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                                            Running
                                        </span>
                                    </div>
                                )}
                                {hasUnsavedChanges && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                                        <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">
                                            Unsaved
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                            onClick={() => handleSave()}
                                            disabled={
                                                !activeFile ||
                                                !activeFile.hasUnsavedChanges
                                            }
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                                        Save{" "}
                                        <span className="font-mono text-blue-400">
                                            ⌘S
                                        </span>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                            onClick={handleSaveAll}
                                            disabled={!hasUnsavedChanges}
                                        >
                                            <Save className="h-4 w-4" /> All
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                                        Save All{" "}
                                        <span className="font-mono text-blue-400">
                                            ⌘⇧S
                                        </span>
                                    </TooltipContent>
                                </Tooltip>

                                <Separator
                                    orientation="vertical"
                                    className="h-6 bg-slate-800"
                                />

                                <ToggleAI
                                    isEnabled={aiSuggestions.isEnabled}
                                    onToggle={aiSuggestions.toggleEnabled}
                                    suggestionLoading={aiSuggestions.isLoading}
                                />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-slate-900/95 border border-slate-800 backdrop-blur-sm text-slate-200"
                                    >
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setIsPreviewVisible(
                                                    !isPreviewVisible,
                                                )
                                            }
                                            className="hover:bg-slate-800 focus:bg-slate-800"
                                        >
                                            {isPreviewVisible ? (
                                                <>
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Hide Preview
                                                </>
                                            ) : (
                                                <>
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Show Preview
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-800" />
                                        <DropdownMenuItem
                                            onClick={closeAllFiles}
                                            className="hover:bg-slate-800 focus:bg-slate-800"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Close All Files
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="relative flex-1">
                        {openFiles.length > 0 ? (
                            <div className="h-full flex flex-col">
                                {/* File Tabs */}
                                <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
                                    <Tabs
                                        value={activeFileId || ""}
                                        onValueChange={setActiveFileId}
                                    >
                                        <div className="flex items-center justify-between px-4 py-1.5">
                                            <TabsList className="h-8 bg-transparent p-0 gap-0.5">
                                                {openFiles.map((file) => (
                                                    <TabsTrigger
                                                        key={file.id}
                                                        value={file.id}
                                                        className="relative h-8 px-3 data-[state=active]:bg-slate-800/50 data-[state=active]:text-slate-100 data-[state=active]:shadow-sm group text-slate-400 hover:text-slate-200 transition-all duration-200"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-3 w-3" />
                                                            <span className="text-xs font-mono">
                                                                {file.filename}.
                                                                {
                                                                    file.fileExtension
                                                                }
                                                            </span>
                                                            {file.hasUnsavedChanges && (
                                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                                                            )}
                                                            <span
                                                                className="ml-1 h-4 w-4 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    closeFile(
                                                                        file.id,
                                                                    );
                                                                }}
                                                            >
                                                                <X className="h-2.5 w-2.5" />
                                                            </span>
                                                        </div>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            {openFiles.length > 1 && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={closeAllFiles}
                                                    className="h-6 px-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                                >
                                                    Close All
                                                </Button>
                                            )}
                                        </div>
                                    </Tabs>
                                </div>

                                {/* Editor and Preview */}
                                <div className="flex-1 relative">
                                    <ResizablePanelGroup
                                        direction="horizontal"
                                        className="h-full"
                                    >
                                        <ResizablePanel
                                            defaultSize={
                                                isPreviewVisible ? 55 : 100
                                            }
                                        >
                                            <div className="h-full relative">
                                                <PlaygroundEditor
                                                    activeFile={activeFile}
                                                    content={
                                                        activeFile?.content ||
                                                        ""
                                                    }
                                                    onContentChange={(value) =>
                                                        activeFileId &&
                                                        updateFileContent(
                                                            activeFileId,
                                                            value,
                                                        )
                                                    }
                                                    suggestion={
                                                        aiSuggestions.suggestion
                                                    }
                                                    suggestionLoading={
                                                        aiSuggestions.isLoading
                                                    }
                                                    suggestionPosition={
                                                        aiSuggestions.position
                                                    }
                                                    onAcceptSuggestion={(
                                                        editor,
                                                        monaco,
                                                    ) =>
                                                        aiSuggestions.acceptSuggestion(
                                                            editor,
                                                            monaco,
                                                        )
                                                    }
                                                    onRejectSuggestion={(
                                                        editor,
                                                    ) =>
                                                        aiSuggestions.rejectSuggestion(
                                                            editor,
                                                        )
                                                    }
                                                    onTriggerSuggestion={(
                                                        type,
                                                        editor,
                                                    ) =>
                                                        aiSuggestions.fetchSuggestion(
                                                            type,
                                                            editor,
                                                        )
                                                    }
                                                    templateData={templateData!}
                                                    onSave={handleSaveForEditor}
                                                    onSaveAll={handleSaveAll}
                                                />
                                            </div>
                                        </ResizablePanel>

                                        {isPreviewVisible && (
                                            <>
                                                <ResizableHandle className="bg-slate-800/50 w-0.5 hover:bg-slate-700 transition-colors" />
                                                <ResizablePanel
                                                    defaultSize={45}
                                                >
                                                    <div className="h-full relative bg-slate-900/30">
                                                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                                                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                                                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                                                            </div>
                                                            <span className="text-[10px] font-mono text-slate-400 ml-2">
                                                                Preview
                                                            </span>
                                                            {serverUrl && (
                                                                <span className="text-[10px] font-mono text-emerald-400 ml-auto">
                                                                    ●{" "}
                                                                    {serverUrl}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="pt-8 h-full">
                                                            <WebContainerPreview
                                                                templateData={
                                                                    templateData
                                                                }
                                                                instance={
                                                                    instance
                                                                }
                                                                writeFileSync={
                                                                    writeFileSync
                                                                }
                                                                isLoading={
                                                                    containerLoading
                                                                }
                                                                error={
                                                                    containerError
                                                                }
                                                                serverUrl={
                                                                    serverUrl!
                                                                }
                                                                forceResetup={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </ResizablePanel>
                                            </>
                                        )}
                                    </ResizablePanelGroup>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full items-center justify-center gap-4 bg-slate-950/50">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                                    <div className="relative h-20 w-20 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
                                        <FileText className="h-10 w-10 text-slate-600" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-medium text-slate-300">
                                        No files open
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Select a file from the sidebar to start
                                        editing
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                                    <span className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700">
                                        ⌘P
                                    </span>
                                    <span>to search files</span>
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarInset>

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={confirmationDialog.isOpen}
                    title={confirmationDialog.title}
                    description={confirmationDialog.description}
                    onConfirm={confirmationDialog.onConfirm}
                    onCancel={confirmationDialog.onCancel}
                    setIsOpen={(open) =>
                        setConfirmationDialog((prev) => ({
                            ...prev,
                            isOpen: open,
                        }))
                    }
                />
            </div>
        </TooltipProvider>
    );
};

export default MainPlaygroundPage;
