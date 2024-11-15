import { apiClients } from './api';

export const tournamentService = {
  getAllTournaments: async () => {
    try {
      const response = await apiClients.tournament.get('/tournaments');
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  },

  getTournamentById: async (tournamentId) => {
    try {
      const response = await apiClients.tournament.get(`/tournaments/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournament:', error);
      throw error;
    }
  },

  updateTournament: async (tournamentId, tournamentData) => {
    try {
      const response = await apiClients.tournament.put(
        `/tournaments/${tournamentId}`,
        tournamentData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating tournament:', error);
      throw error;
    }
  },

  deleteTournament: async (tournamentId) => {
    try {
      const response = await apiClients.tournament.delete(`/tournaments/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  },

  getRecommendedTournaments: async (userRating, userId, ratingRange = 1000) => {
    try {
      const allTournaments = await this.getAllTournaments();
      return allTournaments
        .filter(tournament => 
          Math.abs(tournament.recommended_rating - userRating) <= ratingRange &&
          !tournament.registrants.some(player => player.player_id === userId) &&
          tournament.status === 'upcoming'
        );
    } catch (error) {
      console.error('Error getting recommended tournaments:', error);
      throw error;
    }
  },

  getRecentCompletedTournaments: async () => {
    try {
      const response = await apiClients.tournament.get('/tournaments');
      return response.data
        .filter(tournament => tournament.status === 'completed')
        .sort((a, b) => new Date(b.tournament_end) - new Date(a.tournament_end))
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent completed tournaments:', error);
      throw error;
    }
  },

  createTournament: async (payload) => {
    try {
      const response = await apiClients.tournament.post('/tournaments', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  }
};