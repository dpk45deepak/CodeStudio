"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubRepository } from "../libs/github-api";
import { Search, GitBranch, Star, Users } from "lucide-react";

interface RepoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRepository: (repo: GitHubRepository) => void;
  title?: string;
}

export default function RepoSelectorModal({ 
  isOpen, 
  onClose, 
  onSelectRepository,
  title = "Select GitHub Repository"
}: RepoSelectorModalProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GitHubRepository[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"my-repos" | "search">("my-repos");

  useEffect(() => {
    if (isOpen && activeTab === "my-repos") {
      fetchMyRepositories();
    }
  }, [isOpen, activeTab]);

  const fetchMyRepositories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/github/repositories");
      const data = await response.json();
      if (data.success) {
        setRepositories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchRepositories = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch("/api/github/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error("Failed to search repositories:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && activeTab === "search") {
        searchRepositories();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  const handleSelectRepo = (repo: GitHubRepository) => {
    onSelectRepository(repo);
    onClose();
  };

  const formatRepoSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const RepositoryCard = ({ repo }: { repo: GitHubRepository }) => (
    <Card 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSelectRepo(repo)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {repo.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {repo.description || "No description"}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {repo.private && (
              <Badge variant="secondary" className="text-xs">
                Private
              </Badge>
            )}
            {repo.language && (
              <Badge variant="outline" className="text-xs">
                {repo.language}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              <span>{repo.default_branch}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Updated {new Date(repo.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const displayedRepos = activeTab === "my-repos" ? repositories : searchResults;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b">
            <Button
              variant={activeTab === "my-repos" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-repos")}
              className="rounded-none border-b-2"
            >
              My Repositories
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              onClick={() => setActiveTab("search")}
              className="rounded-none border-b-2"
            >
              Search GitHub
            </Button>
          </div>

          {/* Search Input */}
          {activeTab === "search" && (
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Repository List */}
          <div className="flex-1 overflow-y-auto p-4">
            {(isLoading || isSearching) ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">Loading...</div>
              </div>
            ) : displayedRepos.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">
                  {activeTab === "my-repos" 
                    ? "No repositories found" 
                    : "No repositories found for your search"
                  }
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {displayedRepos.map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
