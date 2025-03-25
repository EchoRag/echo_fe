import { useForm } from 'react-hook-form';
import { Modal, Button } from 'flowbite-react';
import useAxios from '../hooks/useAxios'; // Import useAxios
import { API_PATHS } from '../utils/apiPaths'; // Import API paths

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
  const methods = useForm({ defaultValues: { name: '', description: '' } });
  const { register, reset } = methods;
  const axios = useAxios(); // Move useAxios back to the top level

  const onSubmit = async (data: { name: string; description: string }) => {
    try {
      const response = await axios.post(API_PATHS.PROJECTS, data); // Use API path
      onAddProject(response.data);
      reset();
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Add New Project</Modal.Header>
      <Modal.Body>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                {...register('name', { required: true })}
                data-testid="project-name-input"
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
                {...register('description', { required: true })}
                data-testid="project-description-input"
              />
            </div>
          </div>
          <Modal.Footer>
            <Button
              className="bg-[#2A3365]"
              type="submit"
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
        </form>
      </Modal.Body>
    </Modal>
  );
}