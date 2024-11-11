import axios from 'axios';
import { successToast, errorToast } from '@/utils/toastUtils';
import { getPlayerDetails } from '@/utils/fetchPlayerDetails';

export async function fetchAdminTournaments(organiserName) {
  try {
    // Fetch all tournaments from the specified endpoint
    const response = await fetch('http://localhost:8003/tournaments');
    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }

    const tournaments = await response.json();

    // Filter tournaments where the user is in the registrants list
    const adminTournaments = tournaments.filter(
      (tournament) => tournament.organiser === organiserName
    );

    return adminTournaments;
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return []; // Return an empty array if there's an error
  }
}

export default fetchAdminTournaments;

export const getTournamentData = async (tournament_id) => {
  try {
    const response = await axios.get(
      `http://localhost:8003/tournaments/${tournament_id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch tournament:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return null;
  }
};

export const fetchAdminTournamentPlayableMatches = async (tournament_id) => {
  try {
    const response = await axios.get(
      `http://localhost:8004/matchmaking/tournaments/${tournament_id}/matches`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch tournaments:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return [];
  }
};

export const fetchPlayersFromRegistrants = async (registrants) => {
  try {
    const playerIds = registrants.map((registrant) => registrant.player_id);
    const playerPromises = playerIds.map((id) => getPlayerDetails(id));
    const players = await Promise.all(playerPromises);
    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

export const startTournament = async (tournament) => {
  try {
    // try to pair players to spawn matches
    const pairPlayersResponse = await axios.post(
      `http://localhost:8004/matchmaking/tournaments/${tournament.tournament_id}/pair`
    );
    if (pairPlayersResponse.status == 200) {
      const response = await axios.put(
        `http://localhost:8003/tournaments/${tournament.tournament_id}`,
        {
          tournament_name: tournament.tournament_name,
          status: 'ongoing',
          organiser: tournament.organiser,
          tournament_start: tournament.tournament_start,
          tournament_end: tournament.tournament_end,
          remarks: tournament.remarks,
          recommended_rating: tournament.recommended_rating,
        }
      );
      if (response.status != 200) {
        console.error('Failed to start tournament:', response.statusText);
      } else {
        // create matches for every pair, pairPlayersResponse.data contains the pairs in the form [tournament_id, player1['id'], player1['rating'], player2['id'], player2['rating'], floor(starting_stage), floor(starting_stage/2)]
        for (const pair of pairPlayersResponse.data) {
          const matchResponse = await axios.post(
            `http://localhost:8004/matchmaking/`,
            {
              tournament_id: pair[0],
              player1_id: pair[1],
              player2_id: pair[3],
              scheduled_at: new Date().toISOString(),
              stage: pair[5],
              next_stage: pair[6],
            }
          );
          if (matchResponse.status != 200) {
            console.error('Failed to create match:', matchResponse.statusText);
          }
        }
      }
    } else {
      console.error('Failed to pair players:', pairPlayersResponse.statusText);
    }
    successToast('Tournament started successfully');
  } catch (error) {
    console.error('Error starting tournament:', error);
  }
};

export const setPlayerAsWinner = async (match_id, winner_id) => {
  try {
    const response = await axios.post(
      `http://localhost:8004/matchmaking/${match_id}/results`,
      {
        winner_id: winner_id,
      }
    );
    if (response.status === 200) {
      successToast('Match result updated successfully');
    } else {
      console.error('Failed to update match result:', response.statusText);
      errorToast('Failed to update match result');
    }
  } catch (error) {
    console.error('Error updating match result:', error);
    errorToast('Failed to update match result');
  }
};

export const spawnTournyAndParticipants = async (username) => {
  try {
    const response = await axios.post(`http://localhost:8003/tournaments`, {
      tournament_name: 'Testing Tournament',
      status: 'upcoming',
      organiser: username,
      tournament_start: new Date().toISOString(),
      tournament_end: new Date().toISOString(),
      remarks: 'Test Remarks',
      recommended_rating: 1000,
    });

    if (response.status === 200) {
      const tournament_id = response.data.tournament_id;
      const player_ids = [24, 2, 30, 31, 32, 33, 34];

      // Create an array of promises for registering participants
      const registrationPromises = player_ids.map((player_id) =>
        axios.post(
          `http://localhost:8003/tournaments/${tournament_id}/register`,
          {
            id: tournament_id,
            player_id: player_id,
          }
        )
      );

      // Wait for all registration requests to complete
      const registrationResponses = await Promise.all(registrationPromises);

      // Check if all registration requests were successful
      const allSuccessful = registrationResponses.every(
        (res) => res.status === 200
      );

      if (allSuccessful) {
        successToast('Tournament and participants spawned successfully');
      } else {
        console.error('Failed to add some registrants');
        errorToast('Failed to add some registrants');
      }
    } else {
      console.error(
        'Failed to spawn tournament and participants:',
        response.statusText
      );
      errorToast('Failed to spawn tournament and participants');
    }
  } catch (error) {
    console.error('Error spawning tournament and participants:', error);
    errorToast('Failed to spawn tournament and participants');
  }
};

export const endTournament = async (tournament) => {
  const response = await axios.put(
    `http://localhost:8003/tournaments/${tournament.tournament_id}`,
    {
      tournament_name: tournament.tournament_name,
      status: 'completed',
      organiser: tournament.organiser,
      tournament_start: tournament.tournament_start,
      tournament_end: tournament.tournament_end,
      remarks: tournament.remarks,
      recommended_rating: tournament.recommended_rating,
    }
  );
  if (response.status != 200) {
    console.error('Failed to start tournament:', response.statusText);
  } else {
    successToast('Tournament ended successfully');
  }
}