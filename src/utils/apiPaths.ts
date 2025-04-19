const API_BASE_URL = '/api/v1';

export const API_PATHS = {
  PROJECTS: `${API_BASE_URL}/project`,
  PROJECT_DOCUMENTS: (projectId: string) => `${API_BASE_URL}/document/project/${projectId}`,
  UPLOAD_FILE: `${API_BASE_URL}/document`,
  CHAT_GENERATE: '/generate',
  CONVERSATIONS: `${API_BASE_URL}/conversations`,
  MESSAGE_VOTE: (messageId: string) => `/messages/${messageId}/vote`,
  // Add other paths as needed
} as const;
