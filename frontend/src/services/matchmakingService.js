import { apiClients } from './api';

export const matchmakingService = {
  getPlayerMatches: async (playerId) => {
    try {
      const response = await apiClients.matchmaking.get(`/matchmaking/players/${playerId}/matches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player matches:', error);
      throw error;
    }
  },

  getTournamentMatches: async (tournamentId) => {
    try {
      const response = await apiClients.matchmaking.get(`/matchmaking/tournaments/${tournamentId}/matches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournament matches:', error);
      throw error;
    }
  },

  pairPlayers: async (tournamentId) => {
    try {
      const response = await apiClients.matchmaking.post(`/matchmaking/tournaments/${tournamentId}/pair`);
      return response.data;
    } catch (error) {
      console.error('Error pairing players:', error);
      throw error;
    }
  },

  updateMatchResult: async (matchId, winnerId) => {
    try {
      const response = await apiClients.matchmaking.post(`/matchmaking/${matchId}/results`, {
        winner_id: winnerId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating match result:', error);
      throw error;
    }
  }
};