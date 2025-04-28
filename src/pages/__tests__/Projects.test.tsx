import { render, screen, waitFor } from '@testing-library/react';
import Projects from '../Projects';
import userEvent from '@testing-library/user-event';
import useAxios from '../../hooks/useAxios';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';

// Mock Faro configuration
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: () => null,
      pushEvent: jest.fn(),
    },
  },
}));

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
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockAxios.get.mockResolvedValue({ data: mockProjects });
    (useAxios as jest.Mock).mockReturnValue(mockAxios);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderWithRouter(<Projects />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(6); // Default number of skeleton loaders
  });

  it('renders the projects page title', async () => {
    renderWithRouter(<Projects />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Projects');
    expect(heading).toHaveClass('text-gray-900');
  });

  it('renders all project cards after loading', async () => {
    renderWithRouter(<Projects />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    // Check if all project names are rendered
    mockProjects.forEach(project => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    });
  });

  it('renders action buttons for each project', async () => {
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    const uploadButtons = screen.getAllByText('Upload Documents');
    const callButtons = screen.getAllByText('Add Call');
    const viewDetailsLinks = screen.getAllByText('View Details');

    expect(uploadButtons).toHaveLength(mockProjects.length);
    expect(callButtons).toHaveLength(mockProjects.length);
    expect(viewDetailsLinks).toHaveLength(mockProjects.length);
  });

  it('renders buttons with correct styling', async () => {
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button', { name: /upload documents|add call/i });
    buttons.forEach(button => {
      expect(button).toHaveClass('text-white', 'bg-[#2A3365]', 'hover:bg-blue-800');
    });
  });

  it('renders Add Project button at the center of the page', async () => {
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add project/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Project');
    expect(addButton.parentElement).toHaveClass('flex', 'justify-center');
  });

  it('opens Add Project modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add project/i });
    await user.click(addButton);

    expect(screen.getByText('Add New Project')).toBeInTheDocument();
    expect(screen.getByTestId('project-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('project-description-input')).toBeInTheDocument();
  });

  it('closes Add Project modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    // Open modal
    const addButton = screen.getByRole('button', { name: /add project/i });
    await user.click(addButton);

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
    });
  });


  it('opens Upload File modal when upload button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].name)).toBeInTheDocument();
    });

    // Click upload button
    const uploadButton = screen.getAllByText('Upload Documents')[0];
    await user.click(uploadButton);

    // Verify modal is open
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });
});