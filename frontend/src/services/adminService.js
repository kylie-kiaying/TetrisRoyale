import { apiClients } from './api';
import { tournamentService } from './tournamentService';
import { matchmakingService } from './matchmakingService';

export const adminService = {
  fetchAdminTournaments: async (organiserName) => {
    try {
      const tournaments = await tournamentService.getAllTournaments();
      return tournaments.filter(
        (tournament) => tournament.organiser === organiserName
      );
    } catch (error) {
      console.error('Error fetching admin tournaments:', error);
      throw error;
    }
  },

  getTournamentData: async (tournamentId) => {
    try {
      return await tournamentService.getTournamentById(tournamentId);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      throw error;
    }
  },

  setMatchWinner: async (matchId, winnerId) => {
    try {
      return await matchmakingService.updateMatchResult(matchId, winnerId);
    } catch (error) {
      console.error('Error setting match winner:', error);
      throw error;
    }
  }
};