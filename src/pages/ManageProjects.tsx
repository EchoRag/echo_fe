import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { API_PATHS } from "../utils/apiPaths";
import { Button, Modal, Spinner } from "flowbite-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
}

export function ManageProjects() {
  const axios = useAxios();
  const navigate = useNavigate();

  // State for projects, loading, errors, and modal control
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from the API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_PATHS.PROJECTS);
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Something went wrong while loading projects.");
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id: string) => {
    try {
      await axios.delete(`${API_PATHS.PROJECTS}/${id}`);
      setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // Open edit modal and set selected project details
  const openEditModal = (project: Project) => {
    setEditData({ name: project.name, description: project.description });
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  // Submit edited project details
  const handleEditSubmit = async () => {
    if (!selectedProject) return;

    try {
      await axios.put(`${API_PATHS.PROJECTS}/${selectedProject.id}`, editData);
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === selectedProject.id ? { ...p, ...editData } : p
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        Manage Your Projects
      </h1>

      {loading && <Spinner size="xl" color="blue" className="mx-auto" />}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {project.name}
              </h2>
              <p className="text-gray-600">{project.description}</p>
              <div className="flex space-x-2 mt-3">
                <Button
                  className="bg-[#2A3365] text-white"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Open
                </Button>
                <Button
                  className="bg-yellow-500 text-white"
                  onClick={() => openEditModal(project)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No projects found. Start by adding a new one!
          </p>
        )}
      </div>

      {/* Edit Project Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Project</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-project-name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Project Name
              </label>
              <input
                type="text"
                id="edit-project-name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="edit-project-description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Project Description
              </label>
              <textarea
                id="edit-project-description"
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-[#2A3365]" onClick={handleEditSubmit}>
            Save Changes
          </Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

