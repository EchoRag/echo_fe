import { useState } from 'react';
import { Modal, Button } from 'flowbite-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

interface AddProjectModalProps {
  show: boolean;
  onClose: () => void;
  onAddProject: (project: Omit<Project, 'id' | 'status'>) => void;
}

export function AddProjectModal({ show, onClose, onAddProject }: AddProjectModalProps) {
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const handleSubmit = () => {
    onAddProject(newProject);
    setNewProject({ name: '', description: '' });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Add New Project</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <label htmlFor="project-name" className="block mb-2 text-sm font-medium text-gray-900">
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter project name"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              data-testid="project-name-input"
              required
            />
          </div>
          <div>
            <label htmlFor="project-description" className="block mb-2 text-sm font-medium text-gray-900">
              Project Description
            </label>
            <textarea
              id="project-description"
              rows={4}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter project description"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              data-testid="project-description-input"
              required
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          className="bg-[#2A3365]"
          onClick={handleSubmit}
          data-testid="submit-project-button"
        >
          Add Project
        </Button>
        <Button 
          color="gray"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 