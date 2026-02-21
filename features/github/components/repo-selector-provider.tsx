"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { GitHubRepository } from "../libs/github-api";

interface RepoSelectorContextType {
  isOpen: boolean;
  openModal: (onSelect: (repo: GitHubRepository) => void) => void;
  closeModal: () => void;
  selectedRepo: GitHubRepository | null;
  onSelectRepo: (repo: GitHubRepository) => void;
}

const RepoSelectorContext = createContext<RepoSelectorContextType | undefined>(undefined);

export function RepoSelectorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [onSelectCallback, setOnSelectCallback] = useState<((repo: GitHubRepository) => void) | null>(null);

  const openModal = (onSelect: (repo: GitHubRepository) => void) => {
    setOnSelectCallback(() => onSelect);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRepo(null);
    setOnSelectCallback(null);
  };

  const onSelectRepo = (repo: GitHubRepository) => {
    setSelectedRepo(repo);
    if (onSelectCallback) {
      onSelectCallback(repo);
    }
    closeModal();
  };

  useEffect(() => {
    const handleOpenRepoSelector = (event: any) => {
      const { onSelect } = event.detail;
      openModal(onSelect);
    };

    window.addEventListener("openRepoSelector", handleOpenRepoSelector);
    
    return () => {
      window.removeEventListener("openRepoSelector", handleOpenRepoSelector);
    };
  }, []);

  return (
    <RepoSelectorContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        selectedRepo,
        onSelectRepo,
      }}
    >
      {children}
    </RepoSelectorContext.Provider>
  );
}

export function useRepoSelector() {
  const context = useContext(RepoSelectorContext);
  if (context === undefined) {
    throw new Error("useRepoSelector must be used within a RepoSelectorProvider");
  }
  return context;
}
