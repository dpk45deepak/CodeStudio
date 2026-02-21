"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GitHubRepository } from "../libs/github-api";
import { useRepoSelector } from "../components/repo-selector-provider";
import { Github, ArrowUpRight, Plus } from "lucide-react";

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  playgroundId: string;
  playgroundTitle: string;
}

export default function GitHubExportModal({ 
  isOpen, 
  onClose, 
  playgroundId,
  playgroundTitle 
}: GitHubExportModalProps) {
  const [exportMode, setExportMode] = useState<"existing" | "new">("existing");
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [newRepoName, setNewRepoName] = useState(playgroundTitle);
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState(`Update ${playgroundTitle} from playground`);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      let endpoint;
      let payload;

      if (exportMode === "new") {
        endpoint = "/api/github/create-repo";
        payload = {
          playgroundId,
          repoName: newRepoName,
          description: newRepoDescription,
          isPrivate,
        };
      } else {
        endpoint = "/api/github/export";
        const [owner, repo] = selectedRepo?.full_name.split("/") || [];
        payload = {
          playgroundId,
          owner,
          repo,
          branch,
          commitMessage,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        // Success - close modal and show success message
        alert(data.message);
        onClose();
      } else {
        // Error - show error message
        alert(data.error || "Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoSelect = () => {
    // Open repository selector modal using context
    const { openModal } = useRepoSelector();
    openModal((repo: GitHubRepository) => {
      setSelectedRepo(repo);
      setBranch(repo.default_branch);
    });
  };

  const isFormValid = () => {
    if (exportMode === "new") {
      return newRepoName.trim() !== "";
    } else {
      return selectedRepo !== null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Export to GitHub
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Mode Selection */}
          <div className="space-y-3">
            <Label>Export Mode</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="existing"
                  checked={exportMode === "existing"}
                  onCheckedChange={(checked) => 
                    checked && setExportMode("existing")
                  }
                />
                <Label htmlFor="existing" className="text-sm">
                  Push to existing repository
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new"
                  checked={exportMode === "new"}
                  onCheckedChange={(checked) => 
                    checked && setExportMode("new")
                  }
                />
                <Label htmlFor="new" className="text-sm">
                  Create new repository
                </Label>
              </div>
            </div>
          </div>

          {/* Existing Repository Selection */}
          {exportMode === "existing" && (
            <div className="space-y-2">
              <Label>Repository</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Select a repository"
                  value={selectedRepo?.full_name || ""}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRepoSelect}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Browse
                </Button>
              </div>
            </div>
          )}

          {/* New Repository Details */}
          {exportMode === "new" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repoName">Repository Name</Label>
                <Input
                  id="repoName"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="repository-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRepoDescription}
                  onChange={(e) => setNewRepoDescription(e.target.value)}
                  placeholder="Optional repository description"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <Label htmlFor="private" className="text-sm">
                  Make repository private
                </Label>
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commitMessage">Commit Message</Label>
              <Textarea
                id="commitMessage"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe your changes"
                rows={2}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!isFormValid() || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              "Exporting..."
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
