import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ProjectCard from "../../components/projects/ProjectCard";
import CreateProjectModal from "../../components/projects/CreateProjectModal";
import UpdateProjectModal from "../../components/projects/UpdateProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import { getProjectsRequest } from "../../api/projectsApi";
import { showError } from "../../utils/toast";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);

  // Fetch projects on page load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjectsRequest();
      setProjects(data.content || []);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to load projects";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-2">
            Manage your projects and track progress
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 mb-6">
          {error}
          <button
            type="button"
            onClick={fetchProjects}
            className="ml-4 underline font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600 font-medium">No projects yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Create your first project to get started
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditProject(project)}
              onDelete={() => setDeleteProject(project)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onProjectCreated={fetchProjects}
      />

      <UpdateProjectModal
        open={!!editProject}
        project={editProject}
        onClose={() => setEditProject(null)}
        onProjectUpdated={fetchProjects}
      />

      <DeleteProjectModal
        open={!!deleteProject}
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onProjectDeleted={fetchProjects}
      />
    </div>
  );
}
