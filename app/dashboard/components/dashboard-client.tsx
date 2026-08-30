"use client";

import React from "react";
import ProjectTable from "@/features/dashboard/components/project-table";
import type { Project } from "@/features/dashboard/types";
import {
    deleteProjectById,
    editProjectById,
    duplicateProjectById,
} from "@/features/playground/actions";
import { toast } from "sonner";

interface DashboardClientProps {
    projects: Project[];
}

export default function DashboardClient({ projects }: DashboardClientProps) {
    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProjectById(id);
            toast.success("Project deleted successfully", {
                className: "bg-slate-900 border-slate-800 text-slate-100",
            });
        } catch (error) {
            toast.error("Failed to delete project");
            console.error("Error deleting project:", error);
        }
    };

    const handleUpdateProject = async (
        id: string,
        data: { title: string; description: string },
    ) => {
        try {
            await editProjectById(id, data);
            toast.success("Project updated successfully", {
                className: "bg-slate-900 border-slate-800 text-slate-100",
            });
        } catch (error) {
            toast.error("Failed to update project");
            console.error("Error updating project:", error);
        }
    };

    const handleDuplicateProject = async (id: string) => {
        try {
            await duplicateProjectById(id);
            toast.success("Project duplicated successfully", {
                className: "bg-slate-900 border-slate-800 text-slate-100",
            });
        } catch (error) {
            toast.error("Failed to duplicate project");
            console.error("Error duplicating project:", error);
        }
    };

    return (
        <ProjectTable
            projects={projects}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            onDuplicateProject={handleDuplicateProject}
        />
    );
}
