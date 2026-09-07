"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RepositoryGridSkeleton } from "@/components/ui/loading-state";
import { GitHubRepository } from "../libs/github-api";
import { Search, GitBranch, Star, Users, Lock } from "lucide-react";

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

  // Add skeleton loading on initial load
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchMyRepositories = async () => {
    setIsLoading(true);
    setIsInitialLoading(true);
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
      setIsInitialLoading(false);
    }
  };

  const searchRepositories = useCallback(async () => {
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
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && activeTab === "search") {
        searchRepositories();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab, searchRepositories]);

  const handleSelectRepo = (repo: GitHubRepository) => {
    onSelectRepository(repo);
    onClose();
  };

  // const formatRepoSize = (size: number) => {
  //   if (size < 1024) return `${size} B`;
  //   if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  //   return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  // };

  const RepositoryCard = ({ repo }: { repo: GitHubRepository }) => (
    <Card 
      className="cursor-pointer border border-slate-800 bg-slate-900/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/50 hover:bg-slate-900 hover:shadow-md"
      onClick={() => handleSelectRepo(repo)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {repo.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {repo.description || "No description available"}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 ml-3 shrink-0">
            {repo.private && (
              <Badge variant="secondary" className="text-xs font-medium">
                <Lock className="w-3 h-3 mr-1" />
                Private
              </Badge>
            )}
            {repo.language && (
              <Badge variant="outline" className="text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                {repo.language}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Star className="w-4 h-4" />
              <span className="font-medium">{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium">{repo.default_branch}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Users className="w-4 h-4" />
              <span className="font-medium">{repo.forks_count}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {new Date(repo.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const displayedRepos = activeTab === "my-repos" ? repositories : searchResults;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[calc(100vh-2rem)] max-h-225 w-[calc(100%-2rem)] max-w-7xl flex-col overflow-hidden border-slate-800 bg-slate-950 p-0 text-slate-100 shadow-2xl sm:max-w-7xl">
        <DialogHeader className="border-b border-slate-800 bg-slate-950 p-5 pb-4 sm:p-7 sm:pb-5">
          <DialogTitle className="text-xl font-semibold text-slate-100">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/70 px-3 sm:px-5">
            <Button
              variant={activeTab === "my-repos" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-repos")}
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-slate-400 data-[state=active]:border-blue-400 data-[state=active]:text-blue-300 sm:px-6"
            >
              My Repositories
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              onClick={() => setActiveTab("search")}
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-slate-400 data-[state=active]:border-blue-400 data-[state=active]:text-blue-300 sm:px-6"
            >
              Search GitHub
            </Button>
          </div>

          {/* Search Input */}
          {activeTab === "search" && (
            <div className="border-b border-slate-800 bg-slate-900/40 p-4 sm:p-5">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search repositories by name, language, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 border-slate-700 bg-slate-900 pl-10 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          {/* Repository List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {isInitialLoading ? (
                <RepositoryGridSkeleton count={6} />
              ) : (isLoading || isSearching) ? (
                <div className="flex items-center justify-center h-32">
                  <Spinner size="md" text="Loading repositories..." />
                </div>
              ) : displayedRepos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
                    <GitBranch className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeTab === "my-repos" 
                      ? "No repositories found" 
                      : "No repositories found for your search"
                    }
                  </div>
                  {activeTab === "search" && (
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab("my-repos")}
                      className="mt-2 text-sm"
                    >
                      Browse your repositories instead
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {displayedRepos.map((repo) => (
                    <RepositoryCard key={repo.id} repo={repo} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-800 bg-slate-950 p-4 pt-4 sm:px-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
