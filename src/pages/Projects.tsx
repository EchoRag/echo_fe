import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { AddProjectModal } from '../components/AddProjectModal';
import { EditProjectModal } from '../components/EditProjectModal'; // Import Edit Modal
import useAxios from '../hooks/useAxios';
import { API_PATHS } from '../utils/apiPaths';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null); // State for editing project
  const axios = useAxios();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_PATHS.PROJECTS);
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [axios]);

  const handleAddProject = async (newProject: { name: string; description: string }) => {
    try {
      const response = await axios.post(API_PATHS.PROJECTS, { ...newProject, status: 'active' });
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Failed to add project:', error);
    }
    setShowAddModal(false);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      await axios.put(`${API_PATHS.PROJECTS}/${updatedProject.id}`, updatedProject);
      setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
    setEditProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 drop-shadow-lg">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="relative bg-white border border-gray-200 rounded-lg">
            <div className="flex flex-col items-start p-6 gap-3 w-full h-full">
              <div className="flex flex-col gap-2">
                <h5 className="text-2xl font-bold text-gray-900 font-inter text-left">
                  {project.name}
                </h5>
                <p className="text-base font-normal text-gray-500 font-inter text-left">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-row justify-start items-center gap-3 w-full mt-auto">
                <button
                  onClick={() => setEditProject(project)}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      <div className="flex justify-center mt-8">
        <Button 
          className="bg-[#2A3365] hover:bg-blue-800"
          onClick={() => setShowAddModal(true)}
          data-testid="add-project-button"
        >
          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
          </svg>
          Add Project
        </Button>
      </div>

      {/* Add Project Modal */}
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
          onUpdateProject={handleUpdateProject}
        />
      )}
    </div>
  );
}
