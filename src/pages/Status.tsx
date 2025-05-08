import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { useServerStart } from '../hooks/useServerStart';

interface DependencyStatus {
  status: 'OK' | 'error';
  message?: string;
}

interface HealthResponse {
  status: 'OK' | 'error';
  dependencies: {
    llmServer: DependencyStatus;
    docProc: DependencyStatus;
  };
}

const Status: React.FC = () => {
  const axios = useAxios();
  const { startServer } = useServerStart();
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      const response = await axios.get<HealthResponse>(`${import.meta.env.VITE_APP_API_URI}/health`);
      setHealthStatus(response.data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error checking health:', error);
      setHealthStatus({
        status: 'error',
        dependencies: {
          llmServer: { status: 'error', message: 'Failed to check LLM server status' },
          docProc: { status: 'error', message: 'Failed to check document processing status' }
        }
      });
    }
  };

  const handleStartServer = async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      await startServer();
      // Refresh health status after starting
      await checkHealth();
    } catch (error) {
      setStartError('Failed to start server. Please try again.');
      console.error('Error starting server:', error);
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'OK' | 'error') => {
    switch (status) {
      case 'OK':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'OK' | 'error') => {
    switch (status) {
      case 'OK':
        return 'Operational';
      case 'error':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  if (!healthStatus) {
    return (
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-6">System Status</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-6">System Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Overall Status</h2>
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 ${getStatusColor(healthStatus.status)} rounded-full mr-2`} data-testid="overall-status-indicator"></div>
            <span className="text-gray-600" data-testid="overall-status">{getStatusText(healthStatus.status)}</span>
          </div>
          <div className="text-sm text-gray-500" data-testid="last-checked">
            Last checked: {lastChecked}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">LLM Server</h2>
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 ${getStatusColor(healthStatus.dependencies.llmServer.status)} rounded-full mr-2`} data-testid="llm-server-status-indicator"></div>
            <span className="text-gray-600" data-testid="llm-server-status">{getStatusText(healthStatus.dependencies.llmServer.status)}</span>
          </div>
          {healthStatus.dependencies.llmServer.message && (
            <div className="text-sm text-red-500 mt-2">
              {healthStatus.dependencies.llmServer.message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Document Processing</h2>
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 ${getStatusColor(healthStatus.dependencies.docProc.status)} rounded-full mr-2`} data-testid="doc-proc-status-indicator"></div>
            <span className="text-gray-600" data-testid="doc-proc-status">{getStatusText(healthStatus.dependencies.docProc.status)}</span>
          </div>
          {healthStatus.dependencies.docProc.message && (
            <div className="text-sm text-red-500 mt-2">
              {healthStatus.dependencies.docProc.message}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">System Metrics</h2>
        <div className="flex flex-col space-y-4">
          <a 
            href="https://keith30895.grafana.net/public-dashboards/392179ab87d344c98a329e1d24eb9520"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            data-testid="grafana-dashboard-link"
          >
            View Grafana Dashboard
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={handleStartServer}
            disabled={isStarting || healthStatus?.dependencies.llmServer.status === 'OK'}
            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
              isStarting
                ? 'bg-gray-400 cursor-not-allowed'
                : healthStatus?.dependencies.llmServer.status === 'OK'
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            data-testid="start-server-button"
          >
            {isStarting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Server...
              </>
            ) : healthStatus?.dependencies.llmServer.status === 'OK' ? (
              'Server Running'
            ) : (
              'Start Server'
            )}
          </button>

          {startError && (
            <div className="text-red-500 text-sm mt-2" data-testid="start-error">
              {startError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status; 