const API_BASE_URL = 'http://35.154.210.251:8112/api/v1/user_authentication/';
const API_KEY = 'smproject2025';

const APIHelper = {
  post: async (endpoint: string, headers: Record<string, string>, body?: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'api-key': API_KEY,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      return await response.json();
    } catch (error) {
      console.error(`API Error [POST ${endpoint}]:`, error);
      throw error;
    }
  },

  get: async (endpoint: string, headers: Record<string, string>) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'api-key': API_KEY,
          ...headers,
        },
      });

      return await response.json();
    } catch (error) {
      console.error(`API Error [GET ${endpoint}]:`, error);
      throw error;
    }
  },
};

export default APIHelper;
