import { useState } from "react";
import { Button } from "flowbite-react";
import { AddProjectModal } from "../components/AddProjectModal";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Echo Platform",
    description: "Real-time collaboration tool",
    status: "active",
  },
  {
    id: "2",
    name: "Data Analytics Dashboard",
    description: "Analytics visualization",
    status: "completed",
  },
  {
    id: "3",
    name: "Mobile App Development",
    description: "React Native mobile app",
    status: "on-hold",
  },
  {
    id: "4",
    name: "Web Development",
    description: "Next.js web app",
    status: "active",
  },
  {
    id: "5",
    name: "Cloud Infrastructure",
    description: "Cloud setup and monitoring",
    status: "active",
  },
  {
    id: "6",
    name: "AI Integration",
    description: "Machine learning models integration",
    status: "on-hold",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showModal, setShowModal] = useState(false);

  const handleAddProject = (newProject: {
    name: string;
    description: string;
  }) => {
    const newProjectWithId: Project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      description: newProject.description,
      status: "active",
    };

    setProjects([...projects, newProjectWithId]);
    setShowModal(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9999/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 drop-shadow-lg">
        Projects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative bg-white border border-gray-200 rounded-lg"
          >
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
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
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
          onClick={() => setShowModal(true)}
          data-testid="add-project-button"
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
      <AddProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
