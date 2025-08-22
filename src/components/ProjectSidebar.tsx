import { MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Contract Review Analysis",
    description:
      "Comprehensive review of employment contracts and legal implications...",
  },
  {
    id: "2",
    title: "Case Law Research",
    description:
      "Research on precedent cases for intellectual property disputes...",
  },
  {
    id: "3",
    title: "Compliance Documentation",
    description:
      "GDPR compliance audit and documentation review process...",
  },
  {
    id: "4",
    title: "Legal Brief Draft",
    description:
      "Draft legal brief for upcoming litigation case preparation...",
  },
  {
    id: "5",
    title: "Due Diligence Report",
    description:
      "Corporate due diligence for merger and acquisition transaction...",
  },
];

interface ProjectItemProps {
  project: Project;
  onClick?: () => void;
}

const ProjectItem = ({ project, onClick }: ProjectItemProps) => (
  <div
    onClick={onClick}
    className="p-4 rounded-xl cursor-pointer transition-all duration-200 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  >
    <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
      {project.title}
    </h4>
    <p className="text-xs text-legal-gray line-clamp-2 leading-relaxed">
      {project.description}
    </p>
  </div>
);

export const ProjectsSidebar = () => {
  return (
    <div className="w-80 p-5 border-l border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Projects</span>
          <span className="text-sm text-legal-gray">({projects.length})</span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 text-legal-gray" />
        </button>
      </div>

      {/* New Project Button */}
      {/* <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer mb-5 transition-all duration-200 hover:border-primary hover:bg-blue-50 hover:text-primary">
        <span className="text-sm font-medium">+ New Project</span>
      </div> */}

      {/* Projects List */}
      <div className="space-y-2">
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
