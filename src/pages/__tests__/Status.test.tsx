import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Status from '../Status';
import useAxios from '../../hooks/useAxios';
import { useServerStart } from '../../hooks/useServerStart';

// Mock the dependencies
jest.mock('../../hooks/useAxios');
jest.mock('../../hooks/useServerStart');
jest.mock('../../utils/faroConfig', () => ({
    faro: {
      api: {
        getOTEL: () => null,
        pushEvent: jest.fn(),
      },
    },
  }));
interface HealthResponse {
  status: 'OK' | 'error';
  dependencies: {
    llmServer: { status: 'OK' | 'error' };
    docProc: { status: 'OK' | 'error' };
  };
}

describe('Status', () => {
  const mockAxios = {
    get: jest.fn(),
  };

  const mockStartServer = jest.fn();

  const mockHealthResponse: HealthResponse = {
    status: 'OK',
    dependencies: {
      llmServer: { status: 'OK' },
      docProc: { status: 'OK' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAxios as jest.Mock).mockReturnValue(mockAxios);
    (useServerStart as jest.Mock).mockReturnValue({ startServer: mockStartServer });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state initially', () => {
    mockAxios.get.mockImplementation(() => new Promise(() => {}));
    render(<Status />);
    expect(screen.getByText('Checking system status...')).toBeInTheDocument();
  });

  it('renders health status correctly', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockHealthResponse });

    render(<Status />);

    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByTestId('overall-status')).toHaveTextContent('Operational');
      expect(screen.getByTestId('llm-server-status')).toHaveTextContent('Operational');
      expect(screen.getByTestId('doc-proc-status')).toHaveTextContent('Operational');
    });
  });

  it('handles health check error', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<Status />);

    await waitFor(() => {
      expect(screen.getByTestId('overall-status')).toHaveTextContent('Down');
      expect(screen.getByTestId('llm-server-status')).toHaveTextContent('Down');
      expect(screen.getByTestId('doc-proc-status')).toHaveTextContent('Down');
      expect(screen.getByText('Failed to check LLM server status')).toBeInTheDocument();
      expect(screen.getByText('Failed to check document processing status')).toBeInTheDocument();
    });
  });

  it('refreshes health status every 30 seconds', async () => {
    mockAxios.get
      .mockResolvedValueOnce({ data: mockHealthResponse })
      .mockResolvedValueOnce({ data: { ...mockHealthResponse, status: 'error' } });

    render(<Status />);

    // Initial check
    await waitFor(() => {
      expect(screen.getByTestId('overall-status')).toHaveTextContent('Operational');
    });

    // Advance timer by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    // Should show error status after refresh
    await waitFor(() => {
      expect(screen.getByTestId('overall-status')).toHaveTextContent('Down');
    });

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });

  it('handles server start successfully', async () => {
    const errorHealthResponse: HealthResponse = {
      ...mockHealthResponse,
      dependencies: {
        ...mockHealthResponse.dependencies,
        llmServer: { status: 'error' },
      },
    };

    mockAxios.get.mockResolvedValueOnce({ data: errorHealthResponse });
    mockStartServer.mockResolvedValueOnce(undefined);
    mockAxios.get.mockResolvedValueOnce({ data: mockHealthResponse });

    render(<Status />);

    await waitFor(() => {
      expect(screen.getByTestId('start-server-button')).toHaveTextContent('Start Server');
    });

    fireEvent.click(screen.getByTestId('start-server-button'));

    // Should show loading state
    expect(screen.getByTestId('start-server-button')).toHaveTextContent('Starting Server...');

    // Wait for server start to complete
    await waitFor(() => {
      expect(screen.getByTestId('start-server-button')).toHaveTextContent('Server Running');
    });

    expect(mockStartServer).toHaveBeenCalledTimes(1);
  });

  it('handles server start error', async () => {
    const errorHealthResponse: HealthResponse = {
      ...mockHealthResponse,
      dependencies: {
        ...mockHealthResponse.dependencies,
        llmServer: { status: 'error' },
      },
    };

    mockAxios.get.mockResolvedValueOnce({ data: errorHealthResponse });
    mockStartServer.mockRejectedValueOnce(new Error('Start failed'));

    render(<Status />);

    await waitFor(() => {
      expect(screen.getByTestId('start-server-button')).toHaveTextContent('Start Server');
    });

    fireEvent.click(screen.getByTestId('start-server-button'));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByTestId('start-error')).toHaveTextContent('Failed to start server. Please try again.');
    });

    expect(mockStartServer).toHaveBeenCalledTimes(1);
  });

  it('disables start button when server is running', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockHealthResponse });

    render(<Status />);

    await waitFor(() => {
      const startButton = screen.getByTestId('start-server-button');
      expect(startButton).toHaveTextContent('Server Running');
      expect(startButton).toBeDisabled();
    });
  });

  it('disables start button while starting server', async () => {
    const errorHealthResponse: HealthResponse = {
      ...mockHealthResponse,
      dependencies: {
        ...mockHealthResponse.dependencies,
        llmServer: { status: 'error' },
      },
    };

    mockAxios.get.mockResolvedValueOnce({ data: errorHealthResponse });
    mockStartServer.mockImplementation(() => new Promise(() => {}));

    render(<Status />);

    await waitFor(() => {
      expect(screen.getByTestId('start-server-button')).toHaveTextContent('Start Server');
    });

    fireEvent.click(screen.getByTestId('start-server-button'));

    const startButton = screen.getByTestId('start-server-button');
    expect(startButton).toHaveTextContent('Starting Server...');
    expect(startButton).toBeDisabled();
  });

  it('displays Grafana dashboard link', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockHealthResponse });

    render(<Status />);

    await waitFor(() => {
      const dashboardLink = screen.getByTestId('grafana-dashboard-link');
      expect(dashboardLink).toHaveTextContent('View Grafana Dashboard');
      expect(dashboardLink).toHaveAttribute('href', 'https://keith30895.grafana.net/public-dashboards/392179ab87d344c98a329e1d24eb9520');
      expect(dashboardLink).toHaveAttribute('target', '_blank');
      expect(dashboardLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
}); 