"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-0 shadow-sm"
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
      <DialogContent className="max-w-4xl h-[80vh] max-h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b bg-background">
            <Button
              variant={activeTab === "my-repos" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-repos")}
              className="rounded-none border-b-2 px-6 py-3"
            >
              My Repositories
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              onClick={() => setActiveTab("search")}
              className="rounded-none border-b-2 px-6 py-3"
            >
              Search GitHub
            </Button>
          </div>

          {/* Search Input */}
          {activeTab === "search" && (
            <div className="p-4 border-b bg-muted/30">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search repositories by name, language, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          )}

          {/* Repository List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {isInitialLoading ? (
                <RepositoryGridSkeleton count={6} />
              ) : (isLoading || isSearching) ? (
                <div className="flex items-center justify-center h-32">
                  <Spinner size="md" text="Loading repositories..." />
                </div>
              ) : displayedRepos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
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

        <DialogFooter className="p-4 pt-4 border-t bg-background">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
