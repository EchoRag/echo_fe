const API_BASE_URL = '/api/v1';

export const API_PATHS = {
  PROJECTS: `${API_BASE_URL}/project`,
  PROJECT_DOCUMENTS: (projectId: string) => `${API_BASE_URL}/document/project/${projectId}`,
  REPROCESS_DOCUMENT: (documentId: string) => `${API_BASE_URL}/document/${documentId}/reprocess`,
  UPLOAD_FILE: `${API_BASE_URL}/document`,
  CHAT_GENERATE: `${API_BASE_URL}/conversations/generate`,
  CONVERSATIONS: `${API_BASE_URL}/conversations`,
  MESSAGE_VOTE: (messageId: string) => `${API_BASE_URL}/conversations/messages/${messageId}/vote`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATION_READ: (notificationId: string) => `${API_BASE_URL}/notifications/${notificationId}/read`,
  RECAPTCHA: {
    ASSESS: `${API_BASE_URL}/recaptcha/assess`,
  },
  PROXY_SERVER: {
    START: `${API_BASE_URL}/proxy-server/start`,
  },
  // Add other paths as needed
} as const;

export const getApiPath = (path: keyof typeof API_PATHS) => {
  return API_PATHS[path];
};
