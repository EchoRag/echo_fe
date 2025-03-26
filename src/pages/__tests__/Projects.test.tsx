import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Projects from '../Projects';
import userEvent from '@testing-library/user-event';
import useAxios from '../../hooks/useAxios';

// Mock axios
jest.mock('../../hooks/useAxios');

const mockProjects = [
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
    status: 'active'
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application built with React Native for iOS and Android devices.',
    status: 'active'
  },
  {
    id: '4',
    name: 'Web Development',
    description: 'Responsive web application built with React and Next.js for desktop and mobile devices.',
    status: 'active'
  },
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
    status: 'active'
  }
];

describe('Projects', () => {
  beforeEach(() => {
    // Mock API response
    let mockAxios: jest.Mock = jest.fn().mockResolvedValueOnce({
      data: mockProjects
    });
    (useAxios as jest.Mock).mockReturnValue({ get: mockAxios });

    render(<Projects />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the projects page title', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Projects');
    expect(heading).toHaveClass('text-gray-900');
  });

  it('renders all project cards', async () => {
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    // Check if all project names are rendered
    mockProjects.forEach(project => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });

    // Check if all project descriptions are rendered
    mockProjects.forEach(project => {
      expect(screen.getByText(project.description)).toBeInTheDocument();
    });
  });

  it('renders action buttons for each project', async () => {
    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });
    const uploadButtons = screen.getAllByText('Upload Documents');
    const callButtons = screen.getAllByText('Add Call');

    // Should have one button of each type per project
    expect(uploadButtons).toHaveLength(mockProjects.length);
    expect(callButtons).toHaveLength(mockProjects.length);
  });

  it('renders buttons with correct styling', async () => {
    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });
    const buttons = screen.getAllByRole('button', { name: /upload documents|add call/i });
    buttons.forEach(button => {
      expect(button).toHaveClass('text-white', 'bg-[#2A3365]', 'hover:bg-blue-800');
    });
  });

  it('renders Add Project button at the center of the page', async () => {
    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });
    const addButton = screen.getByTestId('add-project-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Project');
    expect(addButton.parentElement).toHaveClass('flex', 'justify-center');
  });

  it('opens a modal when Add Project button is clicked', async () => {
    const addButton = screen.getByTestId('add-project-button');

    // Modal should not be visible initially
    expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();

    // Click the button
    fireEvent.click(addButton);

    // Now the modal should be visible
    expect(screen.getByText('Add New Project')).toBeInTheDocument();
    expect(screen.getByTestId('project-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('project-description-input')).toBeInTheDocument();
  });


  it('closes the modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const addButton = screen.getByTestId('add-project-button');

    // Open the modal
    await user.click(addButton);

    // Modal should be visible
    expect(screen.getByText('Add New Project')).toBeInTheDocument();

    // Click the Cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
    });
  });
});