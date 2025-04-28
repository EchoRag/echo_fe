import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';

// Mock Faro
jest.mock('../../utils/faroConfig', () => ({
  faro: {
    api: {
      getOTEL: () => null,
      pushEvent: jest.fn()
    }
  }
}));

// Mock Firebase
jest.mock('../../firebase', () => ({
  messaging: {
    // Mock any methods you need from messaging
  }
}));

// Mock useAuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuthContext: () => ({
    signOut: jest.fn()
  })
}));

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

describe('Navigation', () => {
  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  it('renders the navigation bar with transparent background', () => {
    renderNavigation();
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('bg-transparent');
  });

  it('renders the Echo logo', () => {
    renderNavigation();
    const logo = screen.getByAltText('Echo Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/echologo.svg');
    expect(logo).toHaveClass('h-14', 'w-14');
  });

  it('renders the Echo brand text', () => {
    renderNavigation();
    const brandText = screen.getByText('Echo');
    expect(brandText).toBeInTheDocument();
    expect(brandText).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
  });

  it('renders the user menu button', () => {
    renderNavigation();
    const userButton = screen.getByLabelText('User menu');
    expect(userButton).toBeInTheDocument();
    expect(userButton).toHaveClass('rounded-full');
  });

  it('renders the user icon in the button', () => {
    renderNavigation();
    const userIcon = screen.getByLabelText('User menu').querySelector('svg');
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveClass('w-6', 'h-6', 'text-white');
  });

  it('has correct link to home page', () => {
    renderNavigation();
    const homeLink = screen.getByRole('link', { name: /echo/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
}); 