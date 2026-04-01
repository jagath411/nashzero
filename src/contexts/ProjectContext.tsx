import { createContext, useContext, useState, ReactNode } from "react";

interface SiteBoundary {
  coordinates: [number, number][];
  center: [number, number];
  area: number; // m²
}

interface Project {
  id: string;
  name: string;
  location: string;
  site: SiteBoundary;
  createdAt: string;
}

interface ProjectContextType {
  project: Project | null;
  setProject: (p: Project | null) => void;
  projects: Project[];
  addProject: (p: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (p: Project) => {
    setProjects((prev) => [...prev, p]);
    setProject(p);
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be inside ProjectProvider");
  return ctx;
}
