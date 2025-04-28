import { render, screen, fireEvent } from '@testing-library/react';
import { EditProjectModal } from '../EditProjectModal';

describe('EditProjectModal', () => {
  const mockProject = {
    id: '123',
    name: 'Test Project',
    description: 'Test Description'
  };

  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <EditProjectModal
        project={mockProject}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(container).toMatchSnapshot();
  });

  it('renders with initial project data', () => {
    // ... rest of the existing tests ...
  });
}); 