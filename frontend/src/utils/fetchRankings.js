import axios from 'axios';

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get('http://localhost:8005/ratings/all');
    const players = response.data;

    // Sort by rating
    players.sort((a, b) => b.rating - a.rating);

    // Fetch profile pictures for each player
    const playersWithAvatars = await Promise.all(
      players.slice(0, 50).map(async (player, index) => {
        try {
          // Use player_id to fetch the profile picture for the current player
          const profileResponse = await axios.get(
            `http://localhost:8002/players/${player.player_id}`
          );

          // Use the profile picture URL if available, otherwise use the fallback
          const profilePicture =
            profileResponse.data?.profile_picture || '/user.png';
          const playerUsername = profileResponse.data?.username || player.username;

          // Ensure the profile picture is a valid URL or fallback
          return {
            player_id: player.player_id,
            rank: index + 1,
            username: playerUsername,
            rating: Math.floor(player.rating * 100) / 100,
            avatar: profilePicture.startsWith('http')
              ? profilePicture
              : '/user.png', // Ensure it's a full URL or fallback
          };
        } catch (error) {
          console.error(
            `Error fetching profile picture for ${player.username}:`,
            error
          );
          return {
            player_id: player.player_id,
            rank: index + 1,
            username: player.username,
            rating: Math.floor(player.rating * 100) / 100,
            avatar: '/user.png', // Use fallback if there's an error
          };
        }
      })
    );

    return playersWithAvatars;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
