import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { SideNav } from '../SideNav';

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

describe('SideNav', () => {
  const mockUseLocation = useLocation as jest.Mock;

  beforeEach(() => {
    // Reset mocks and set default location
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/' });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders all main navigation items', () => {
    renderWithRouter(<SideNav />);
    
    const mainItems = ['New Chat', 'Notifications', 'Projects', 'Help'];
    mainItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders bottom navigation items', () => {
    renderWithRouter(<SideNav />);
    
    const bottomItems = ['Logs', 'Connection Status', 'Settings'];
    bottomItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders history sections when not collapsed', () => {
    renderWithRouter(<SideNav />);
    
    const historyItems = [
      'Pinned Chats',
      'Recent Chats',
      'API Integration Discussion',
      'UI Component Library'
    ];
    
    historyItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('collapses and expands when toggle button is clicked', () => {
    renderWithRouter(<SideNav />);
    
    const toggleButton = screen.getByRole('button', { name: /collapse/i });
    const sideNav = screen.getByTestId('sidenav');
    
    // Initial state - expanded
    expect(sideNav).toHaveClass('w-64');
    
    // Click to collapse
    fireEvent.click(toggleButton);
    expect(sideNav).toHaveClass('w-[60px]');
    expect(screen.queryByTestId('pinned-chats')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(toggleButton);
    expect(sideNav).toHaveClass('w-64');
    expect(screen.getByTestId('pinned-chats')).toBeInTheDocument();
  });


  it('applies active styles to current route', () => {
    mockUseLocation.mockReturnValue({ pathname: '/projects' });
    renderWithRouter(<SideNav />);
    
    const projectsLink = screen.getByTestId('nav-item-projects');
    expect(projectsLink).toHaveClass('bg-black/20');
  });

  it('renders notification popover for notifications item', () => {
    renderWithRouter(<SideNav />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    const notificationButton = screen.getByTestId('nav-item-notifications');
    fireEvent.click(notificationButton);
    
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('maintains navigation items visibility in expanded state', () => {
    renderWithRouter(<SideNav />);
    
    const mainItems = ['New Chat', 'Notifications', 'Projects', 'Help'];
    const bottomItems = ['Logs', 'Connection Status', 'Settings'];
    
    [...mainItems, ...bottomItems].forEach(item => {
      const element = screen.getByText(item);
      expect(element).not.toHaveClass('hidden');
    });
  });

  it('hides text labels when collapsed', () => {
    renderWithRouter(<SideNav />);
    
    const toggleButton = screen.getByRole('button', { name: /collapse/i });
    fireEvent.click(toggleButton);
    
    const mainItems = ['New Chat', 'Projects'];
    mainItems.forEach(item => {
      const element = screen.getByText(item);
      expect(element).toHaveClass('hidden');
    });
  });
}); 