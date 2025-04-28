import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { SideNav } from '../SideNav';
import { useConversations } from '../../hooks/useConversations';
import useAxios from '../../hooks/useAxios';
// Mock Faro configuration
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: () => null,
      pushEvent: jest.fn(),
    },
  },
}));
// Mock Firebase
jest.mock('../../firebase', () => ({
  messaging: {
    onMessage: jest.fn(),
  },
}));
// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));
// Mock useConversations hook
jest.mock('../../hooks/useConversations', () => ({
  useConversations: jest.fn()
}));
// Mock useAxios hook
jest.mock('../../hooks/useAxios', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('SideNav', () => {
  const mockUseLocation = useLocation as jest.Mock;
  const mockUseConversations = useConversations as jest.Mock;
  const mockUseAxios = useAxios as jest.Mock;

  const mockConversations = [
    { id: '1', name: 'API Integration Discussion', path: '/chat/1', isPinned: true },
    { id: '2', name: 'UI Component Library', path: '/chat/2', isPinned: false }
  ];

  beforeEach(() => {
    // Reset mocks and set default values
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/' });
    mockUseConversations.mockReturnValue({
      conversations: mockConversations,
      loading: false,
      error: null
    });
    mockUseAxios.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          notifications: [],
          total: 0,
          page: 1,
          limit: 6
        }
      }),
      put: jest.fn().mockResolvedValue({})
    });
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

  it('renders conversation sections when expanded', () => {
    renderWithRouter(<SideNav />);
    
    // Click expand button to show conversations
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Pinned Chats')).toBeInTheDocument();
    expect(screen.getByText('Recent Chats')).toBeInTheDocument();
    expect(screen.getByText('API Integration Discussion')).toBeInTheDocument();
    expect(screen.getByText('UI Component Library')).toBeInTheDocument();
  });

  it('hides conversation sections when collapsed', () => {
    renderWithRouter(<SideNav />);
    
    expect(screen.queryByText('Pinned Chats')).not.toBeInTheDocument();
    expect(screen.queryByText('Recent Chats')).not.toBeInTheDocument();
  });

  it('shows loading state when conversations are loading', async () => {
    mockUseConversations.mockReturnValue({
      conversations: [],
      loading: true,
      error: null
    });

    renderWithRouter(<SideNav />);
    
    // Click expand button to show conversations
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    // Wait for the loading state to be visible
    await screen.findByTestId('sidenav-content');
    const loadingSpinner = screen.getByTestId('sidenav-content').querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('shows error state when conversations fail to load', async () => {
    mockUseConversations.mockReturnValue({
      conversations: [],
      loading: false,
      error: 'Failed to load conversations'
    });

    renderWithRouter(<SideNav />);
    
    // Click expand button to show conversations
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    expect(screen.getByText('Error loading conversations')).toBeInTheDocument();
  });

  it('collapses and expands when toggle button is clicked', async () => {
    renderWithRouter(<SideNav />);
    
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    const sideNav = screen.getByTestId('sidenav');
    
    // Initial state - collapsed
    expect(sideNav).toHaveClass('w-[60px]');
    
    // Click to expand
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(sideNav).toHaveClass('w-64');
    expect(screen.getByTestId('pinned-chats')).toBeInTheDocument();
    
    // Click to collapse
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(sideNav).toHaveClass('w-[60px]');
    expect(screen.queryByTestId('pinned-chats')).not.toBeInTheDocument();
  });

  it('applies active styles to current route', () => {
    mockUseLocation.mockReturnValue({ pathname: '/projects' });
    renderWithRouter(<SideNav />);
    
    const projectsLink = screen.getByTestId('nav-item-projects');
    expect(projectsLink).toHaveClass('bg-black/20');
  });

  it('renders notification popover for notifications item', async () => {
    renderWithRouter(<SideNav />);
    
    const notificationButton = screen.getByTestId('nav-item-notifications');
    await act(async () => {
      fireEvent.click(notificationButton);
    });
    
    // Wait for the popover to be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('maintains navigation items visibility in expanded state', async () => {
    renderWithRouter(<SideNav />);
    
    // Click expand button
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    const mainItems = ['New Chat', 'Notifications', 'Projects', 'Help'];
    const bottomItems = ['Logs', 'Connection Status', 'Settings'];
    
    [...mainItems, ...bottomItems].forEach(item => {
      const element = screen.getByText(item);
      expect(element).not.toHaveClass('hidden');
    });
  });

  it('hides text labels when collapsed', () => {
    renderWithRouter(<SideNav />);
    
    const mainItems = ['New Chat', 'Projects'];
    mainItems.forEach(item => {
      const element = screen.getByText(item);
      expect(element).toHaveClass('hidden');
    });
  });

  it('calls onCollapseChange callback when toggled', async () => {
    const onCollapseChange = jest.fn();
    renderWithRouter(<SideNav onCollapseChange={onCollapseChange} />);
    
    const toggleButton = screen.getByRole('button', { name: /expand/i });
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    expect(onCollapseChange).toHaveBeenCalledWith(false);
    
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });
}); 