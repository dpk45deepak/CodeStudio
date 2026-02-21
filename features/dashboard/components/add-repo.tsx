"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import RepoSelectorModal from "@/features/github/components/repo-selector-modal";
import { GitHubRepository } from "@/features/github/libs/github-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddRepo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleSelectRepository = async (repo: GitHubRepository) => {
    try {
      // Import the repository and create a new playground
      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repo.owner.login,
          repo: repo.name,
          branch: repo.default_branch,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Create a new playground with the imported template
        const createResponse = await fetch("/api/playground/create-from-github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: repo.name,
            description: repo.description || `Imported from ${repo.full_name}`,
            template: "CUSTOM", // Custom template type for imported repos
            templateData: data.data,
            githubRepo: {
              owner: repo.owner.login,
              repo: repo.name,
              branch: repo.default_branch,
              url: repo.html_url,
            },
          }),
        });

        const createData = await createResponse.json();
        
        if (createData.success) {
          toast("Repository imported successfully!");
          router.push(`/playground/${createData.playgroundId}`);
        } else {
          toast.error("Failed to create playground from repository");
        }
      } else {
        toast.error(data.error || "Failed to import repository");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import repository");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-gray-900 cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-gray-800 hover:border-blue-500 hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.3)]
        hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors duration-300"
            size={"icon"}
          >
            <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-blue-600">Open Github Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Work with your repositories in our editor</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      
      <RepoSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectRepository={handleSelectRepository}
        title="Import GitHub Repository"
      />
    </>
  )
}

export default AddRepo
