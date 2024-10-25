'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Player {
  user_id: number;
  username: string;
  email: string;
  rating: number;
  profile_picture: string | null;
  availability_status: string;
  match_history: any[];
  date_created: string;
  last_updated: string;
}

export default function PlayerDetails() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8002/players');
        setPlayers(response.data);
      } catch (err) {
        setError('Error fetching player details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (players.length === 0) return <div>No player data found</div>;

  return (
    <div>
      <h1>Player Details</h1>
      {players.map((player) => (
        <div key={player.user_id}>
          <p>ID: {player.user_id}</p>
          <p>Name: {player.username}</p>
          <p>Email: {player.email}</p>
          <p>Rating: {player.rating}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
