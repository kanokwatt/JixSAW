import axios from 'axios';

// Create Axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove token from localStorage
      localStorage.removeItem('access_token');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Login API - POST /login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response with access_token
 */
export const loginAPI = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 form uses 'username' field
    formData.append('password', password);

    const response = await api.post('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Save token to localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
  }
};

/**
 * Chat with AI API - POST /chat (No token required)
 * @param {string} message - User message
 * @param {Array} history - Chat history array
 * @returns {Promise<Object>} - AI response
 */
export const chatWithAI = async (message, history = []) => {
  try {
    // Create a temporary axios instance without auth interceptor for public endpoint
    const publicApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await publicApi.post('/chat', {
      message,
      history,
    });

    return response.data;
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get AI response.');
  }
};

/**
 * Upload X-ray image for diagnosis - POST /diagnosis/upload
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<Object>} - Diagnosis result
 */
export const uploadXray = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Add progress tracking if callback provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      };
    }

    const response = await api.post('/diagnosis/upload', formData, config);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Please login first to upload images.');
    }
    
    throw new Error(error.response?.data?.detail || 'Failed to upload and analyze image.');
  }
};

/**
 * Register new user - POST /register
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (default: patient)
 * @returns {Promise<Object>} - Registration result
 */
export const registerAPI = async (email, password, role = 'patient') => {
  try {
    const response = await api.post('/register', {
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.detail || 'Registration failed. Please try again.');
  }
};

/**
 * Get current user info - GET /users/me
 * @returns {Promise<Object>} - User info
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get user info.');
  }
};

/**
 * Logout function - Clear token and redirect
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

export default api;
