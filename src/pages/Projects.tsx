import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { AddProjectModal } from "../components/AddProjectModal";
import { EditProjectModal } from "../components/EditProjectModal";
import { UploadFileModal } from "../components/UploadFileModal";
import useAxios from "../hooks/useAxios";
import { API_PATHS } from "../utils/apiPaths";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
}

const ProjectSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="absolute top-2 right-2">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="flex flex-wrap gap-3 mt-4">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const axios = useAxios();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_PATHS.PROJECTS);
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [axios]);


  const handleAddProject = async (newProject: { name: string; description: string }) => {
    try {
      const response = await axios.post(API_PATHS.PROJECTS, {
        ...newProject,
        status: "active",
      });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
    setShowAddModal(false);
  };

  const handleUpdateProject = async (updatedProject: { id: string; name: string; description: string }) => {
    try {
      await axios.put(`${API_PATHS.PROJECTS}/${updatedProject.id}`, updatedProject);
      setProjects(
        projects.map((p) =>
          p.id === updatedProject.id ? { ...p, ...updatedProject } : p
        )
      );
    } catch (error) {
      console.error("Failed to update project:", error);
    }
    setEditProject(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      // Delete the associated files from cloud storage
      await axios.delete(`${API_PATHS.PROJECTS}/${projectId}/delete-files`);
      console.log(`Files for project ${projectId} deleted from cloud storage`);

      // Delete the project from the database
      await axios.delete(`${API_PATHS.PROJECTS}/${projectId}`);
      console.log(`Project ${projectId} deleted from database`);

      // Re-fetch projects after deletion
      await fetchProjects();
    } catch (error) {
      console.error("Failed to delete project or files:", error);
    }
  };

  const handleUploadFile = async (fileData: {
    file: File;
    fileName: string;
    isCallRecording: boolean;
    isCallTranscript: boolean;
  }) => {
    if (!selectedProjectId) return;

    try {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("fileName", fileData.fileName);
      formData.append("isCallRecording", fileData.isCallRecording.toString());
      formData.append("isCallTranscript", fileData.isCallTranscript.toString());
      formData.append("projectId", selectedProjectId);

      await axios.post(API_PATHS.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 drop-shadow-lg">
        Projects
      </h1>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
// Show skeleton loaders
          Array.from({ length: 6 }).map((_, index) => (
            <ProjectSkeleton key={index} />
          ))
        ) : (
      //Show actual projects
          projects.map((project) => (
            <div
              key={project.id}
              className="relative bg-white border border-gray-200 rounded-lg p-6"
            >
              {/* Dropdown Menu */}
              <div className="absolute top-2 right-2">
                <button
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const dropdown = document.getElementById(
                      `dropdown-${project.id}`
                    );
                    dropdown?.classList.toggle("hidden");
                  }}
                >
                  &#x2026;
                </button>

                <div
                  id={`dropdown-${project.id}`}
                  className="hidden absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-md z-10"
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white bg-[#2A3365] hover:bg-[#1e2550]"
                    onClick={() => {
                      setEditProject(project);
                      document
                        .getElementById(`dropdown-${project.id}`)
                        ?.classList.add("hidden");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      handleDeleteProject(project.id);
                      document
                        .getElementById(`dropdown-${project.id}`)
                        ?.classList.add("hidden");
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h5 className="text-2xl font-bold text-gray-900">
                  {project.name}
                </h5>
                <p className="text-base font-normal text-gray-500">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  className="text-white bg-[#2A3365] hover:bg-blue-800 px-3 py-2 rounded-lg"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setShowUploadModal(true);
                  }}
                >
                  Upload Documents
                </button>

                <button
                  type="button"
                  className="text-white bg-[#2A3365] hover:bg-blue-800 px-3 py-2 rounded-lg"
                >
                  Add Call
                </button>

                <Link
                  to={`/projects/${project.id}`}
                  className="text-blue-500 hover:underline px-3 py-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Project Button */}
      <div className="flex justify-center mt-8">
        <Button
          className="bg-[#2A3365] hover:bg-blue-800"
          onClick={() => setShowAddModal(true)}
        >
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5v14m-7-7h14"
            />
          </svg>
          Add Project
        </Button>
      </div>
      
{/* Add Project Modal */}
      {/* Modals */}
      <AddProjectModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProject={handleAddProject}
      />
{/* Edit Project Modal */}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onUpdate={handleUpdateProject}
        />
      )}
{/* Upload File Modal */}
      <UploadFileModal
        show={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedProjectId(null);
        }}
        onUpload={handleUploadFile}
      />
    </div>
  );
}
