import { apiClients } from './api';

export const authService = {
  forgotPassword: async (email) => {
    try {
      const response = await apiClients.auth.post('/auth/forgot-password', {
        recovery_email: email,
      });
      return response.data;
    } catch (error) {
      console.error('Error during forgot password:', error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClients.auth.post(`/auth/reset-password/${token}`, {
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error during password reset:', error);
      throw error;
    }
  },

  register: async (payload) => {
    try {
      const response = await apiClients.auth.post('/auth/register/', payload);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClients.auth.post('/auth/logout/', {
        credentials: 'include',
      });
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },
};