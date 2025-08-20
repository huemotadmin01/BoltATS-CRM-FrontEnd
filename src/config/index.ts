export const MOCK_API = true; // Toggle for mock vs real API

export const API_CONFIG = {
  baseUrl: MOCK_API ? '/mock' : '/api',
  timeout: 10000,
  retries: 3,
};

export const MOCK_LATENCY = {
  min: 250,
  max: 500,
};

export const THEME = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#10B981',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: 8, // 8px base spacing system
} as const;

export const KEYBOARD_SHORTCUTS = {
  NEW: 'KeyN',
  SEARCH: 'Slash',
  COMMAND_PALETTE: 'KeyK',
  GOTO_JOBS: 'KeyJ',
  GOTO_CANDIDATES: 'KeyC',
  GOTO_ACCOUNTS: 'KeyA',
  GOTO_OPPORTUNITIES: 'KeyO',
} as const;