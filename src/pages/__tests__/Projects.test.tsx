import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';

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
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('text-white', 'bg-[#2A3365]', 'hover:bg-blue-800');
    });
  });
}); 