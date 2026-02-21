"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GitHubExportModal from "@/features/github/components/github-export-modal";
import { Github } from "lucide-react";

interface GitHubExportButtonProps {
  playgroundId: string;
  playgroundTitle: string;
  className?: string;
}

export default function GitHubExportButton({ 
  playgroundId, 
  playgroundTitle,
  className = ""
}: GitHubExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Github className="w-4 h-4" />
        Export to GitHub
      </Button>
      
      <GitHubExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        playgroundId={playgroundId}
        playgroundTitle={playgroundTitle}
      />
    </>
  );
}
