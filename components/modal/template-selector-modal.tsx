"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// TemplateSelectionModal.tsx
type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "WEB_PLATFORM" | "VITE_REACT_TS" | "TUTORIALKIT" | "TYPESCRIPT" | "JAVASCRIPT";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}

function TemplateIcon({ template }: { template: TemplateOption }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        aria-label={`${template.name} icon`}
        className="text-2xl font-bold"
        style={{ color: template.color }}
      >
        {template.name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={template.icon}
      alt={`${template.name} icon`}
      width={40}
      height={40}
      unoptimized
      onError={() => setHasError(true)}
      className="object-contain"
    />
  );
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/expressjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["React", "Fullstack", "JavaScript"],
    features: [
      "Reactive Data Binding",
      "Component System",
      "Virtual DOM",
      "Dependency Injection",
      "TypeScript Support",
    ],
    category: "fullstack",
  },
  {
    id: "web-platform",
    name: "Web Platform",
    description: "A lightweight static HTML, CSS, and JavaScript starter for the browser.",
    icon: "/web-platform.svg",
    color: "#38BDF8",
    popularity: 4,
    tags: ["HTML", "CSS", "JavaScript"],
    features: ["Static HTML", "Modern CSS", "Browser APIs"],
    category: "frontend",
  },
  {
    id: "vite-react-ts",
    name: "Vite React TypeScript",
    description: "A fast React and TypeScript starter powered by Vite.",
    icon: "/vite.svg",
    color: "#646CFF",
    popularity: 5,
    tags: ["React", "Vite", "TypeScript"],
    features: ["Fast HMR", "React", "TypeScript"],
    category: "frontend",
  },
  {
    id: "tutorialkit",
    name: "TutorialKit",
    description: "An interactive documentation and tutorial project starter.",
    icon: "/tutorialkit.svg",
    color: "#F59E0B",
    popularity: 3,
    tags: ["Tutorials", "Docs", "Learning"],
    features: ["Interactive Lessons", "Documentation", "Exercises"],
    category: "fullstack",
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "A minimal TypeScript starter for building typed applications.",
    icon: "/typescript.svg",
    color: "#3178C6",
    popularity: 4,
    tags: ["TypeScript", "Node.js", "Typed"],
    features: ["Type Checking", "Modern Tooling", "JavaScript Output"],
    category: "backend",
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "A minimal JavaScript starter for quick experiments and apps.",
    icon: "/javascript.svg",
    color: "#F7DF1E",
    popularity: 4,
    tags: ["JavaScript", "Node.js", "Web"],
    features: ["Quick Start", "Browser Ready", "Node Compatible"],
    category: "backend",
  },
];

const requiredTemplateIds = [
  "react",
  "express",
  "nextjs",
  "angular",
  "web-platform",
  "vite-react-ts",
  "tutorialkit",
  "typescript",
  "javascript",
] as const;

const availableTemplates = requiredTemplateIds
  .map((templateId) => templates.find((template) => template.id === templateId))
  .filter((template): template is TemplateOption => Boolean(template));

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack"
  >("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = availableTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      category === "all" || template.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      setStep("configure");
    }
  };

  const handleCreateProject = () => {
    if (selectedTemplate) {
      const templateMap: Record<
        string,
        "REACT" | "NEXTJS" | "EXPRESS" | "ANGULAR" | "WEB_PLATFORM" | "VITE_REACT_TS" | "TUTORIALKIT" | "TYPESCRIPT" | "JAVASCRIPT"
      > = {
        react: "REACT",
        nextjs: "NEXTJS",
        express: "EXPRESS",
        angular: "ANGULAR",
        "web-platform": "WEB_PLATFORM",
        "vite-react-ts": "VITE_REACT_TS",
        tutorialkit: "TUTORIALKIT",
        typescript: "TYPESCRIPT",
        javascript: "JAVASCRIPT",
      };

      const template = templates.find((t) => t.id === selectedTemplate);
      onSubmit({
        title: projectName || `New ${template?.name} Project`,
        template: templateMap[selectedTemplate] || "REACT",
        description: template?.description,
      });

      console.log(
        `Creating ${projectName || "new project"} with template: ${
          template?.name
        }`
      );
      onClose();
      // Reset state for next time
      setStep("select");
      setSelectedTemplate(null);
      setProjectName("");
    }
  };

  const handleBack = () => {
    setStep("select");
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          // Reset state when closing
          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
        }
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-7xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-2xl sm:max-w-7xl sm:p-8">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
                  <Plus size={20} />
                </span>
                Select a Template
              </DialogTitle>
              <DialogDescription>
                Choose a template to create your new playground
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
                    size={18}
                  />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setCategory(value as "all" | "frontend" | "backend" | "fullstack")}
                >
                  <TabsList className="grid h-10 w-full grid-cols-4 border border-slate-800 bg-slate-900 sm:w-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={handleSelectTemplate}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative flex cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5
                          ${
                            selectedTemplate === template.id
                              ? "border-red-400/70 bg-red-500/10 shadow-[0_0_0_1px_rgba(248,113,113,0.35),0_12px_30px_rgba(239,68,68,0.12)]"
                              : "border-slate-800 bg-slate-900/70 hover:border-red-400/50 hover:bg-slate-900"
                          }`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <div className="absolute top-4 right-4 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        {selectedTemplate === template.id && (
                          <div className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <div
                            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${template.color}15` }}
                          >
                            <TemplateIcon template={template} />
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {template.name}
                              </h3>
                              <div className="flex gap-1">
                                {template.category === "frontend" && (
                                  <Code size={14} className="text-blue-500" />
                                )}
                                {template.category === "backend" && (
                                  <Server
                                    size={14}
                                    className="text-green-500"
                                  />
                                )}
                                {template.category === "fullstack" && (
                                  <Globe
                                    size={14}
                                    className="text-purple-500"
                                  />
                                )}
                              </div>
                            </div>

                            <p className="mb-3 text-sm leading-5 text-slate-400">
                              {template.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-slate-700 bg-slate-800/70 px-2 py-1 text-xs text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                      <Search size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">
                        No templates found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>
                  Estimated setup time:{" "}
                  {selectedTemplate ? "2-5 minutes" : "Select a template"}
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#E93F3F] hover:bg-[#d03636]"
                  disabled={!selectedTemplate}
                  onClick={handleContinue}
                >
                  Continue <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#e93f3f]">
                Configure Your Project
              </DialogTitle>
              <DialogDescription>
                {templates.find((t) => t.id === selectedTemplate)?.name} project
                configuration
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="p-4 shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)] rounded-lg border">
                <h3 className="font-medium mb-2">Selected Template Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap size={14} className="text-[#E93F3F]" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                className="bg-[#E93F3F] hover:bg-[#d03636]"
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
