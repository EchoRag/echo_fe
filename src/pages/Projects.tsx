import { useState } from 'react';
import { Button } from 'flowbite-react';
import { AddProjectModal } from '../components/AddProjectModal';

// import { Card } from 'flowbite-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Echo Platform',
    description: 'A modern project management platform with real-time collaboration features and intuitive interface.',
    status: 'active'
  },
  {
    id: '2',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics visualization platform with customizable widgets and reporting tools.',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application built with React Native for iOS and Android devices.',
    status: 'on-hold'
  },
  {
    id: '4',
    name: 'Web Development',
    description: 'Responsive web application built with React and Next.js for desktop and mobile devices.',
    status: 'active'
  }
  ,
  {
    id: '5',
    name: 'Cloud Infrastructure',
    description: 'Enterprise-grade cloud infrastructure setup with automated scaling and monitoring capabilities.',
    status: 'active'
  },
  {
    id: '6',
    name: 'AI Integration',
    description: 'Machine learning models integration for predictive analytics and automated decision making.',
    status: 'on-hold'
  }
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showModal, setShowModal] = useState(false);

  const handleAddProject = (newProject: { name: string; description: string }) => {
    const newProjectWithId: Project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'active'
    };
    
    setProjects([...projects, newProjectWithId]);
    setShowModal(false);
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
                <button type="button" className="text-white bg-[#2A3365] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2  text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Upload Documents
                  <svg className="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01" />
                  </svg>
                </button>
                <button type="button" className="text-white bg-[#2A3365] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-3 py-2  text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Add Call
                  <svg className="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
                  </svg>
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
          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14" />
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