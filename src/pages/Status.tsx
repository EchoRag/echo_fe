import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'up' | 'down' | 'checking';
  lastChecked: string;
}

const Status: React.FC = () => {
  const axios = useAxios();
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Echo LLM', url: 'http://192.168.1.34:8001/health', status: 'checking', lastChecked: '' },
    { name: 'Echo Doc Processing', url: 'http://192.168.1.34:8000/health', status: 'checking', lastChecked: '' },
    { name: 'Echo Backend', url: 'http://localhost:3000/api-docs', status: 'checking', lastChecked: '' }
  ]);

  const checkServiceHealth = async (service: ServiceStatus) => {
    try {
      const response = await axios.get(service.url);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const checkAllServices = async () => {
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          const isHealthy = await checkServiceHealth(service);
          return {
            ...service,
            status: isHealthy ? 'up' as const : 'down' as const,
            lastChecked: new Date().toLocaleTimeString()
          };
        })
      );
      setServices(updatedServices);
    };

    // Initial check
    checkAllServices();

    // Check every 30 seconds
    const interval = setInterval(checkAllServices, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'up':
        return 'bg-green-500';
      case 'down':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'up':
        return 'Operational';
      case 'down':
        return 'Down';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">System Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service) => (
          <div key={service.name} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">{service.name}</h2>
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 ${getStatusColor(service.status)} rounded-full mr-2`}></div>
              <span className="text-gray-600">{getStatusText(service.status)}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last checked: {service.lastChecked || 'Never'}
            </div>
            <div className="mt-2 text-sm text-gray-500 break-all">
              URL: {service.url}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">System Metrics</h2>
        <a 
          href="https://keith30895.grafana.net/goto/XZUohcJNg?orgId=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Grafana Dashboard
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Status; 