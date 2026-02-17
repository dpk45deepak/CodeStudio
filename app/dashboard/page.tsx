import Image from "next/image";

import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";
import DashboardClient from "./components/dashboard-client";

import { getAllPlaygroundForUser } from "@/features/playground/actions";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-gray-900 rounded-lg border border-gray-800">
    <Image
      src="/empty-state.svg"
      alt="No projects"
      width={192}
      height={192}
      className="mb-4"
      priority
    />
    <h2 className="text-xl font-semibold text-gray-300">No projects found</h2>
    <p className="text-gray-400">Create a new project to get started!</p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();

  return (
    <div className="flex flex-col items-center min-h-screen mx-auto max-w-7xl px-4 py-10 bg-gray-950">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="mt-10 flex flex-col items-center w-full">
        {!playgrounds || playgrounds.length === 0 ? (
          <div className="w-full max-w-2xl">
            <EmptyState />
          </div>
        ) : (
          <div className="w-full">
            <DashboardClient projects={playgrounds} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMainPage;
