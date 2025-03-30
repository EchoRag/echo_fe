import { useState } from 'react';

interface EditProjectModalProps {
  project: { id: string; name: string; description: string };
  onClose: () => void;
  onUpdate: (updatedProject: { id: string; name: string; description: string }) => void;
}

export function EditProjectModal({ project, onClose, onUpdate }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSubmit = () => {
    onUpdate({ id: project.id, name, description });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Edit Project</h2>
        <input
          type="text"
          className="border p-2 w-full my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="border p-2 w-full my-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-400 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
