import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Projects } from '../Projects';
import userEvent from '@testing-library/user-event';

describe('Projects', () => {
  beforeEach(() => {
    render(<Projects />);
  });

  it('renders the projects page title', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Projects');
    expect(heading).toHaveClass('text-gray-900');
  });

  it('renders all project cards', () => {
    // Check if all project names are rendered
    const expectedProjects = [
      'Echo Platform',
      'Data Analytics Dashboard',
      'Mobile App Development',
      'Web Development',
      'Cloud Infrastructure',
      'AI Integration'
    ];

    expectedProjects.forEach(projectName => {
      expect(screen.getByText(projectName)).toBeInTheDocument();
    });
    
    // Check if all project descriptions are rendered
    const expectedDescriptions = [
      'A modern project management platform with real-time collaboration features and intuitive interface.',
      'Real-time analytics visualization platform with customizable widgets and reporting tools.',
      'Cross-platform mobile application built with React Native for iOS and Android devices.',
      'Responsive web application built with React and Next.js for desktop and mobile devices.',
      'Enterprise-grade cloud infrastructure setup with automated scaling and monitoring capabilities.',
      'Machine learning models integration for predictive analytics and automated decision making.'
    ];

    expectedDescriptions.forEach(description => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('renders action buttons for each project', () => {
    const uploadButtons = screen.getAllByText('Upload Documents');
    const callButtons = screen.getAllByText('Add Call');
    
    // Should have one button of each type per project
    expect(uploadButtons).toHaveLength(6);
    expect(callButtons).toHaveLength(6);
  });

  it('renders buttons with correct styling', () => {
    const buttons = screen.getAllByRole('button', { name: /upload documents|add call/i });
    buttons.forEach(button => {
      expect(button).toHaveClass('text-white', 'bg-[#2A3365]', 'hover:bg-blue-800');
    });
  });

  it('renders Add Project button at the center of the page', () => {
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

  it('adds a new project when form is submitted', async () => {
    const user = userEvent.setup();
    const addButton = screen.getByTestId('add-project-button');
    
    // Open the modal
    await user.click(addButton);
    
    // Fill in the form
    const nameInput = screen.getByTestId('project-name-input');
    const descriptionInput = screen.getByTestId('project-description-input');
    const submitButton = screen.getByTestId('submit-project-button');
    
    await user.type(nameInput, 'Test Project');
    await user.type(descriptionInput, 'This is a test project description');
    
    // Submit the form
    await user.click(submitButton);
    
    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
    });
    
    // New project should be added to the list
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
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