const API_BASE_URL = '/api/v1';

export const API_PATHS = {
  PROJECTS: `${API_BASE_URL}/project`,
  PROJECT_DOCUMENTS: (projectId: string) => `${API_BASE_URL}/document/project/${projectId}`,
  UPLOAD_FILE: `${API_BASE_URL}/documents`,
  CHAT_GENERATE: '/generate',
  CONVERSATIONS: `${API_BASE_URL}/conversations`,
  // Add other paths as needed
} as const;
