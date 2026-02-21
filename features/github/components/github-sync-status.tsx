"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Github, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight,
  ExternalLink 
} from "lucide-react";

interface SyncStatus {
  isSynced: boolean;
  lastSync?: string;
  repository?: {
    owner: string;
    repo: string;
    branch: string;
    url: string;
  };
  pendingChanges?: number;
}

interface GitHubSyncStatusProps {
  playgroundId: string;
  className?: string;
}

export default function GitHubSyncStatus({ 
  playgroundId, 
  className = "" 
}: GitHubSyncStatusProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchSyncStatus();
  }, [playgroundId]);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`/api/github/sync-status/${playgroundId}`);
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sync status:", error);
    }
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/github/sync/${playgroundId}`, {
        method: "POST",
      });
      
      if (response.ok) {
        await fetchSyncStatus();
      }
    } catch (error) {
      console.error("Failed to sync:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    
    if (syncStatus.isSynced) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    if (!syncStatus) return "Status unknown";
    
    if (syncStatus.isSynced) {
      return syncStatus.lastSync 
        ? `Synced ${new Date(syncStatus.lastSync).toLocaleDateString()}`
        : "Synced";
    } else {
      return syncStatus.pendingChanges 
        ? `${syncStatus.pendingChanges} pending changes`
        : "Not synced";
    }
  };

  const getStatusBadge = () => {
    if (!syncStatus) return <Badge variant="secondary">Unknown</Badge>;
    
    if (syncStatus.isSynced) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Synced</Badge>;
    } else {
      return <Badge variant="outline">Out of sync</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            <CardTitle className="text-lg">GitHub Sync</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {/* Repository Info */}
        {syncStatus?.repository && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <div className="font-medium">Repository:</div>
              <div className="flex items-center gap-2">
                <span>{syncStatus.repository.owner}/{syncStatus.repository.repo}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(syncStatus.repository?.url || "", "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">Branch:</div>
              <span>{syncStatus.repository.branch}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {syncStatus?.repository ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Syncing..." : "Sync"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Export to GitHub
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
