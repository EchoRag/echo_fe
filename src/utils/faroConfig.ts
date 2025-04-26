import { matchRoutes } from 'react-router-dom';
import { initializeFaro, createReactRouterV6DataOptions, ReactIntegration, getWebInstrumentations } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

const faroInstance = initializeFaro({
  url: import.meta.env.VITE_APP_FARO_URL || 'https://localhost:3020',
  app: {
    name: import.meta.env.VITE_APP_NAME || 'echo-fe',
    version: '1.0.0',
    environment: import.meta.env.MODE
  },
  
  instrumentations: [
    // Mandatory, omits default instrumentations otherwise.
    ...getWebInstrumentations(),

    // Tracing package to get end-to-end visibility for HTTP requests.
    new TracingInstrumentation(),

    // React integration for React applications.
    new ReactIntegration({
      router: createReactRouterV6DataOptions({
        matchRoutes,
      }),
    }),
  ],
});

// Add custom event methods
export const faro = {
  ...faroInstance,
  pushEvent: (name: string, attributes?: Record<string, any>) => {
    faroInstance.api.pushEvent(name, attributes);
  }
} as const; 