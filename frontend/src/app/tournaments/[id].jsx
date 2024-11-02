import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TournamentDetails() {
  const router = useRouter();
  const { id } = router.query; // Capture the tournament ID from the URL
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch tournament details from the backend using the ID
      async function fetchTournamentDetails() {
        try {
          const response = await fetch(
            `http://localhost:8003/tournaments/${id}`
          );
          const data = await response.json();
          setTournament(data);
        } catch (error) {
          console.error('Error fetching tournament details:', error);
        }
      }
      fetchTournamentDetails();
    }
  }, [id]);

  if (!tournament) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>Organizer: {tournament.organizer}</p>
      <p>Start Date: {tournament.startDate}</p>
      <p>End Date: {tournament.endDate}</p>
      <p>Recommended Rating: {tournament.recommendedRating}</p>
      {/* Display other details as needed */}
    </div>
  );
}
