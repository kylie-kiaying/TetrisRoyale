import pytest
from unittest.mock import AsyncMock, patch
from app.service.matchmaking_service import MatchmakingService
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository


@pytest.mark.asyncio
async def test_pair_players_success():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock the registrants for the tournament
    tournament_repo.get_tournament_registrants.return_value = [1, 2, 3, 4]

    # Mock match creation in the matchmaking repository
    matchmaking_repo.create_match.side_effect = [
        {"id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None},
        {"id": 2, "tournament_id": 1, "player1_id": 3, "player2_id": 4, "status": "scheduled", "winner_id": None},
    ]

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act
    result = await matchmaking_service.pair_players(1)

    # Assert
    assert len(result) == 2
    assert result[0]["player1_id"] == 1
    assert result[0]["player2_id"] == 2
    assert result[1]["player1_id"] == 3
    assert result[1]["player2_id"] == 4
    matchmaking_repo.create_match.assert_called()


@pytest.mark.asyncio
async def test_pair_players_not_enough_players():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock only one player registered
    tournament_repo.get_tournament_registrants.return_value = [1]

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await matchmaking_service.pair_players(1)

    assert str(exc_info.value) == "Not enough players registered for pairing"


@pytest.mark.asyncio
async def test_get_matches_by_tournament():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock the matches returned by the repository
    matchmaking_repo.get_matches_by_tournament.return_value = [
        {"id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None}
    ]

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act
    result = await matchmaking_service.get_matches_by_tournament(1)

    # Assert
    assert len(result) == 1
    assert result[0]["player1_id"] == 1
    assert result[0]["player2_id"] == 2
    matchmaking_repo.get_matches_by_tournament.assert_called_with(1)


@pytest.mark.asyncio
async def test_get_player_matches():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock the matches for a player
    matchmaking_repo.get_player_matches.return_value = [
        {"id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None},
        {"id": 2, "tournament_id": 1, "player1_id": 1, "player2_id": 3, "status": "scheduled", "winner_id": None},
    ]

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act
    result = await matchmaking_service.get_player_matches(1)

    # Assert
    assert len(result) == 2
    assert result[0]["player1_id"] == 1
    assert result[1]["player1_id"] == 1
    matchmaking_repo.get_player_matches.assert_called_with(1)


@pytest.mark.asyncio
async def test_submit_match_result_success():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock updating the match result
    matchmaking_repo.update_match_result.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "completed", "winner_id": 1
    }

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act
    result = await matchmaking_service.submit_match_result(1, 1)

    # Assert
    assert result["status"] == "completed"
    assert result["winner_id"] == 1
    matchmaking_repo.update_match_result.assert_called_with(1, 1)


@pytest.mark.asyncio
async def test_submit_match_result_not_found():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    
    # Mock match not found
    matchmaking_repo.update_match_result.side_effect = Exception("Match not found")

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await matchmaking_service.submit_match_result(1, 1)

    assert str(exc_info.value) == "Error updating match result: Match not found"
