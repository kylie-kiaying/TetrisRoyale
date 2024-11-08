export async function fetchRecentCompletedTournaments() {
  try {
    // Fetch all tournaments from the specified endpoint
    const response = await fetch('http://localhost:8003/tournaments');
    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }

    const tournaments = await response.json();

    // Filter to get only completed tournaments
    const completedTournaments = tournaments
      .filter((tournament) => tournament.completed)
      // Sort by `tournament_end` date in descending order (most recent first)
      .sort((a, b) => new Date(b.tournament_end) - new Date(a.tournament_end))
      // Slice to get the top 10 most recent completed tournaments
      .slice(0, 10);

    return completedTournaments;
  } catch (error) {
    console.error('Error fetching recent completed tournaments:', error);
    return []; // Return an empty array if there's an error
  }
}
