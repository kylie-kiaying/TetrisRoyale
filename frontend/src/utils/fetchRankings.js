import axios from 'axios';

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get('http://localhost:8005/ratings'); // Adjust endpoint as necessary
    const players = response.data;

    // Sort by rating
    players.sort((a, b) => b.rating - a.rating);

    // players = players.slice(0, 50); // get top 50 only

    // Map over the sorted players to add ranking and format as required
    const rankedPlayers = players.map((player, index) => ({
      rank: index + 1,
      username: player.username,
      rating: Math.floor(player.rating * 100) / 100,
      avatar: `/path-to-image/${player.username}`, // Adjust avatar path as needed
    }));

    return rankedPlayers.slice(0, 50);

    return players.slice(0, 50); // Return top 50 players
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return [];
  }
};
