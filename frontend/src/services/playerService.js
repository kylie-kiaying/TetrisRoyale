import { apiClients } from './api';

export const playerService = {
  getAllPlayers: async () => {
    try {
      const response = await apiClients.player.get('/players');
      return response.data;
    } catch (error) {
      console.error('Error fetching all players:', error);
      throw error;
    }
  },

  getPlayerDetails: async (userId) => {
    try {
      const response = await apiClients.player.get(`/players/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player details:', error);
      throw error;
    }
  },

  getPlayerMatchesWithDetails: async (userId) => {
    try {
      let matches = await apiClients.matchmaking.get(`/matchmaking/players/${userId}/matches`);
      matches = matches.data.filter((match) => match.status === 'completed');
      matches.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));

      const [matchDetails, tournamentDetails, opponentDetails] = await Promise.all([
        apiClients.analytics.get(`/analytics/players/${userId}`),
        Promise.all(matches.map(match => 
          apiClients.tournament.get(`/tournaments/${match.tournament_id}`)
        )),
        Promise.all(matches.map(match => {
          const opponentId = match.player1_id === userId ? match.player2_id : match.player1_id;
          return apiClients.player.get(`/players/${opponentId}`);
        }))
      ]);

      return matches.map((match, index) => ({
        ...match,
        tournament_name: tournamentDetails[index].data.tournament_name,
        opponent: opponentDetails[index].data.username,
        opponent_img: opponentDetails[index].data.profile_picture,
        result: match.winner_id === userId ? 'Win' : 'Loss',
        ...this._extractMatchStatistics(matchDetails.data, match.id)
      }));
    } catch (error) {
      console.error('Error fetching player matches with details:', error);
      throw error;
    }
  },

  _extractMatchStatistics: (matchDetails, matchId) => {
    const match = matchDetails.find(detail => detail.match_id === matchId);
    if (!match) {
      return {
        pieces_placed: null,
        pps: null,
        kpp: null,
        apm: null,
        finesse_percentage: null,
        lines_cleared: null
      };
    }
    return {
      pieces_placed: match.pieces_placed,
      pps: match.pps,
      kpp: match.kpp,
      apm: match.apm,
      finesse_percentage: match.finesse_percentage,
      lines_cleared: match.lines_cleared
    };
  },

  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClients.player.post(`/players/${userId}/profile-picture`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
};