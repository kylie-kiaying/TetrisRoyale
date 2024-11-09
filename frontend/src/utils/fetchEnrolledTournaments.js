export async function fetchUserTournaments(userId) {
  try {
    // Fetch all tournaments from the specified endpoint
    const response = await fetch('http://localhost:8003/tournaments');
    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }

    const tournaments = await response.json();

    // Filter tournaments where the user is in the registrants list
    const userTournaments = tournaments.filter((tournament) =>
      tournament.registrants.some(
        (registrant) => registrant.player_id === userId
      )
    );

    return userTournaments;
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return []; // Return an empty array if there's an error
  }
}
