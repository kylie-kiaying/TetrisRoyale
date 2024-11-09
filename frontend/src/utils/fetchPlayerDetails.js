import axios from 'axios';

export const getPlayerDetails = async (user_id) => {
    try {
        const response = await axios.get(`http://localhost:8002/players/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player details:', error);
        return null;
    }
};

export const getTournamentNames = async (tournament_id) => {
    try {
        const response = await axios.get(`http://localhost:8003/tournaments/${tournament_id}`);
        return response.data.tournament_name;
    } catch (error) {
        console.error('Error fetching tournament names:', error);
        return null;
    }
};

export const getMatchDetails = async (player_id) => {
    try {
        const response = await axios.get(`http://localhost:8007/analytics/players/${player_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching match details:', error);
        return [];
    }
};

export const getPlayerMatches = async (user_id) => {
    try {
        const response = await axios.get(`http://localhost:8004/matchmaking/players/${user_id}/matches`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player matches:', error);
        return [];
    }
};

export const getPlayerMatchesAndInsertTournamentNameAndStatistics = async (user_id) => {
    try {
        let matches = await getPlayerMatches(user_id);
        matches = matches.filter((match) => match.status === 'completed');

        // Sort matches by descending datetime
        matches.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));

        const matchDetailsPromise = getMatchDetails(user_id);
        const tournamentNamesPromises = matches.map(match => getTournamentNames(match.tournament_id));
        const opponentIds = matches.map(match => match.player1_id === user_id ? match.player2_id : match.player1_id);
        const opponentDetailsPromises = opponentIds.map(id => getPlayerDetails(id));

        const [matchDetails, tournamentNames, opponentDetails] = await Promise.all([
            matchDetailsPromise,
            Promise.all(tournamentNamesPromises),
            Promise.all(opponentDetailsPromises)
        ]);

        const opponentDetailsMap = opponentDetails.reduce((acc, details, index) => {
            acc[opponentIds[index]] = details;
            return acc;
        }, {});

        matches = matches.map((match, index) => {
            match.tournament_name = tournamentNames[index];
            const opponent_id = match.player1_id === user_id ? match.player2_id : match.player1_id;
            const opponent_details = opponentDetailsMap[opponent_id];
            match.opponent = opponent_details.username;
            match.opponent_img = opponent_details.profile_picture;
            match.result = match.winner_id === user_id ? 'Win' : 'Loss';
            const corresponding_match_detail = matchDetails.find(detail => detail.match_id === match.id);
            if (corresponding_match_detail) {
                match.pieces_placed = corresponding_match_detail.pieces_placed;
                match.pps = corresponding_match_detail.pps;
                match.kpp = corresponding_match_detail.kpp;
                match.apm = corresponding_match_detail.apm;
                match.finesse_percentage = corresponding_match_detail.finesse_percentage;
                match.lines_cleared = corresponding_match_detail.lines_cleared;
            } else {
                match.pieces_placed = null;
                match.pps = null;
                match.kpp = null;
                match.apm = null;
                match.finesse_percentage = null;
                match.lines_cleared = null;
            }
            return match;
        });

        return matches;
    } catch (error) {
        console.error('Error fetching player details:', error);
        return [];
    }
};

export const calculateWinRate = (matches, user_id) => {
    const completedMatches = matches.filter(match => match.status === 'completed');
    const matchesWon = completedMatches.filter(match => match.winner_id === user_id).length;
    const matchesLost = completedMatches.length - matchesWon;
    const winRate = completedMatches.length > 0 ? (matchesWon / completedMatches.length) * 100 : 0;

    return {
        matchesWon,
        matchesLost,
        winRate: winRate.toFixed(2) + '%'
    };
};