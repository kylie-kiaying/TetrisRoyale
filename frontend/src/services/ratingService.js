import { apiClients } from './api';

export const ratingService = {
  getAllRatings: async () => {
    try {
      const response = await apiClients.rating.get('/ratings/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all ratings:', error);
      throw error;
    }
  },

  getUserRating: async (userId) => {
    try {
      const response = await apiClients.rating.get(`/ratings/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      throw error;
    }
  }
};