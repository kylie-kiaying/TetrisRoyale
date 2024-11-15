import { apiClients } from './api';

export const analyticsService = {
  getPlayerAnalytics: async (playerId) => {
    try {
      const response = await apiClients.analytics.get(`/analytics/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player analytics:', error);
      throw error;
    }
  },

  getLeaderboard: async () => {
    try {
      const response = await apiClients.rating.get('/ratings/all');
      const players = response.data;
      players.sort((a, b) => b.rating - a.rating);

      const playersWithDetails = await Promise.all(
        players.slice(0, 50).map(async (player, index) => {
          try {
            const profileResponse = await apiClients.player.get(`/players/${player.player_id}`);
            const profilePicture = profileResponse.data?.profile_picture || '/user.png';
            const playerUsername = profileResponse.data?.username || player.username;

            return {
              player_id: player.player_id,
              rank: index + 1,
              username: playerUsername,
              rating: Math.floor(player.rating * 100) / 100,
              avatar: profilePicture.startsWith('http') ? profilePicture : '/user.png',
            };
          } catch (error) {
            return {
              player_id: player.player_id,
              rank: index + 1,
              username: player.username,
              rating: Math.floor(player.rating * 100) / 100,
              avatar: '/user.png',
            };
          }
        })
      );

      return playersWithDetails;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
};