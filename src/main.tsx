// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// API modules
import * as jobsApi from './api/jobs';
import * as applicationsApi from './api/applications';
import * as candidatesApi from './api/candidates';
import * as opportunitiesApi from './api/opportunities';
import * as accountsApi from './api/accounts';
// if you have contactsApi, import it as well

// A single default query function, keyed by the first segment of queryKey
const defaultQueryFn = async ({ queryKey }: { queryKey: unknown[] }) => {
  const [resource] = queryKey as [string, ...unknown[]];

  switch (resource) {
    case 'jobs':           return jobsApi.list();
    case 'applications':   return applicationsApi.list();
    case 'candidates':     return candidatesApi.list();
    case 'opportunities':  return opportunitiesApi.list();
    case 'accounts':       return accountsApi.list();
    // case 'contacts':    return contactsApi.list();
    default:
      throw new Error(`No default queryFn mapped for key "${resource}"`);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  </StrictMode>
);
