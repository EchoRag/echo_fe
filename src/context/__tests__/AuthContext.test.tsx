import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../AuthContext';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { browserStorage } from '../../utils/browserStorage';

// Mock clerk hooks
jest.mock('@clerk/clerk-react', () => ({
  useAuth: jest.fn(),
  useUser: jest.fn(),
  useClerk: jest.fn(),
}));

// Mock browserStorage
jest.mock('../../utils/browserStorage', () => ({
  browserStorage: {
    getAuthData: jest.fn(),
    setAuthData: jest.fn(),
    clearAuthData: jest.fn(),
    isJwtExpired: jest.fn(),
    getJwtExpiry: jest.fn(),
  },
}));

// Mock timers
jest.useFakeTimers();

// Test component that provides access to the auth context
const TestComponent = () => {
  const auth = useAuthContext();
  return (
    <div>
      <pre data-testid="auth-data">{JSON.stringify(auth)}</pre>
      <button onClick={() => auth.signOut()} data-testid="sign-out-button">
        Sign Out
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    primaryEmailAddress: {
      emailAddress: 'john@example.com',
    },
  };

  const mockJwt = 'mock.jwt.token';
  const mockSessionToken = 'mock.session.token';

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      getToken: jest.fn(),
    });
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: null,
    });
    (useClerk as jest.Mock).mockReturnValue({
      signOut: jest.fn(),
    });
    (browserStorage.getAuthData as jest.Mock).mockReturnValue(null);
    (browserStorage.isJwtExpired as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with null auth state when no stored data', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.user).toBeNull();
      expect(authData.jwt).toBeNull();
      expect(authData.sessionToken).toBeNull();
      expect(authData.loading).toBe(false);
    });
  });

  it('should load stored auth data on initialization', async () => {
    const storedAuthData = {
      user: {
        id: 'stored123',
        email: 'stored@example.com',
        name: 'Stored User',
      },
      jwt: 'stored.jwt.token',
      sessionToken: 'stored.session.token',
    };

    // Mock user as signed in and provide stored auth data
    (browserStorage.getAuthData as jest.Mock).mockReturnValue(storedAuthData);
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      getToken: jest.fn().mockResolvedValue(storedAuthData.jwt),
    });
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: {
        id: storedAuthData.user.id,
        firstName: storedAuthData.user.name.split(' ')[0],
        lastName: storedAuthData.user.name.split(' ')[1] || '',
        primaryEmailAddress: {
          emailAddress: storedAuthData.user.email,
        },
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.user).toEqual(storedAuthData.user);
      expect(authData.jwt).toBe(storedAuthData.jwt);
      expect(authData.sessionToken).toBe(storedAuthData.sessionToken);
    });
  });

  it('should update auth state when user signs in', async () => {
    const getToken = jest.fn()
      .mockResolvedValueOnce(mockJwt)
      .mockResolvedValueOnce(mockSessionToken);

    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      getToken,
    });

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: mockUser,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.user).toEqual({
        id: mockUser.id,
        email: mockUser.primaryEmailAddress.emailAddress,
        name: 'John Doe',
      });
      expect(authData.jwt).toBe(mockJwt);
      expect(authData.sessionToken).toBe(mockSessionToken);
    });

    expect(browserStorage.setAuthData).toHaveBeenCalled();
  });

  it('should clear auth state when user signs out', async () => {
    const mockSignOut = jest.fn().mockResolvedValue(undefined);
    (useClerk as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByTestId('sign-out-button').click();
    });

    await waitFor(() => {
      expect(browserStorage.clearAuthData).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });

    const updatedAuthData = JSON.parse(getByTestId('auth-data').textContent || '{}');
    expect(updatedAuthData.user).toBeNull();
    expect(updatedAuthData.jwt).toBeNull();
    expect(updatedAuthData.sessionToken).toBeNull();
  });

  it('should handle JWT expiration', async () => {
    // Setup initial auth state with expired JWT
    const storedAuthData = {
      user: {
        id: 'stored123',
        email: 'stored@example.com',
        name: 'Stored User',
      },
      jwt: 'expired.jwt.token',
      sessionToken: 'stored.session.token',
    };

    const getToken = jest.fn().mockResolvedValue('new.jwt.token');
    (browserStorage.getAuthData as jest.Mock).mockReturnValue(storedAuthData);
    (browserStorage.isJwtExpired as jest.Mock).mockReturnValue(true);
    (browserStorage.getJwtExpiry as jest.Mock).mockReturnValue(Date.now() - 1000);
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      getToken,
    });
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: {
        id: storedAuthData.user.id,
        firstName: storedAuthData.user.name.split(' ')[0],
        lastName: storedAuthData.user.name.split(' ')[1] || '',
        primaryEmailAddress: {
          emailAddress: storedAuthData.user.email,
        },
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Advance timers to trigger JWT expiry check
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getToken).toHaveBeenCalledWith({ template: 'echo_default' });
    });

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.jwt).toBe('new.jwt.token');
    });
  });

  it('should handle error when fetching tokens', async () => {
    const getToken = jest.fn().mockRejectedValue(new Error('Token fetch failed'));

    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      getToken,
    });

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: mockUser,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.user).toBeNull();
      expect(authData.jwt).toBeNull();
      expect(authData.sessionToken).toBeNull();
    });

    expect(browserStorage.clearAuthData).toHaveBeenCalled();
  });

  it('should handle missing email address', async () => {
    const getToken = jest.fn()
      .mockResolvedValueOnce(mockJwt)
      .mockResolvedValueOnce(mockSessionToken);

    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      getToken,
    });

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: { ...mockUser, primaryEmailAddress: null },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authData = JSON.parse(getByTestId('auth-data').textContent || '{}');
      expect(authData.user).toBeNull();
      expect(authData.jwt).toBeNull();
      expect(authData.sessionToken).toBeNull();
    });

    expect(browserStorage.clearAuthData).toHaveBeenCalled();
  });
}); 