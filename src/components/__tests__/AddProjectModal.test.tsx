import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useAxios from '../../hooks/useAxios';
import { AddProjectModal } from '../AddProjectModal';

// Mock Faro configuration
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: () => null,
      pushEvent: jest.fn(),
    },
  },
}));

jest.mock('../../hooks/useAxios');
describe('AddProjectModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAddProject = jest.fn();
  let mockAxios: jest.Mock = jest.fn();
  beforeEach(() => {
    mockAxios.mockClear();
    mockOnClose.mockClear();
    mockOnAddProject.mockClear();
    (useAxios as jest.Mock).mockReturnValue({ post: mockAxios });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders nothing when show is false', () => {
    render(
      <AddProjectModal
        show={false}
        onClose={mockOnClose}
        onAddProject={mockOnAddProject}
      />
    );

    expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
  });

  it('renders modal content when show is true', () => {
    render(
      <AddProjectModal
        show={true}
        onClose={mockOnClose}
        onAddProject={mockOnAddProject}
      />
    );

    expect(screen.getByText('Add New Project')).toBeInTheDocument();
    expect(screen.getByTestId('project-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('project-description-input')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByTestId('submit-project-button')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AddProjectModal
        show={true}
        onClose={mockOnClose}
        onAddProject={mockOnAddProject}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnAddProject).not.toHaveBeenCalled();
  });

  // it('calls onAddProject with correct data when form is submitted', async () => {
  //   const user = userEvent.setup();

  //   render(
  //     <AddProjectModal
  //       show={true}
  //       onClose={mockOnClose}
  //       onAddProject={mockOnAddProject}
  //     />
  //   );

  //   const nameInput = screen.getByTestId('project-name-input');
  //   const descriptionInput = screen.getByTestId('project-description-input');
  //   const submitButton = screen.getByTestId('submit-project-button');

  //   await user.type(nameInput, 'Test Project');
  //   await user.type(descriptionInput, 'This is a test project description');
  //   await user.click(submitButton);

  //   expect(mockOnAddProject).toHaveBeenCalledTimes(1);
  //   expect(mockOnAddProject).toHaveBeenCalledWith({
  //     name: 'Test Project',
  //     description: 'This is a test project description'
  //   });
  // });

  // it('calls onClose when clicking outside the modal', async () => {
  //   render(
  //     <AddProjectModal
  //       show={true}
  //       onClose={mockOnClose}
  //       onAddProject={mockOnAddProject}
  //     />
  //   );

  //   const overlay = screen.getByRole('dialog').parentElement;
  //   if (overlay) {
  //     fireEvent.click(overlay);
  //   }

  //   expect(mockOnClose).toHaveBeenCalledTimes(1);
  // });
}); 