import pytest
from unittest.mock import AsyncMock, patch
import httpx
from app.service.matchmaking_service import MatchmakingService
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository
import os
from dotenv import load_dotenv

pytestmark = pytest.mark.asyncio

@pytest.fixture
async def mock_httpx_client():
    async with httpx.AsyncClient() as client:
        yield client

@pytest.fixture
def matchmaking_service():
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    return MatchmakingService(matchmaking_repo, tournament_repo)


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

@pytest.mark.asyncio
async def test_pair_players_insufficient_players():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    tournament_repo.get_tournament_registrants.return_value = [1]  # Only one player
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Act & Assert
    with pytest.raises(ValueError, match="Not enough players registered for pairing"):
        await matchmaking_service.pair_players(1)


@pytest.mark.asyncio
async def test_get_matches_by_tournament_no_matches():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)
    matchmaking_repo.get_matches_by_tournament.return_value = []

    # Act
    result = await matchmaking_service.get_matches_by_tournament(1)

    # Assert
    assert result == []

@pytest.mark.asyncio
async def test_get_matches_by_tournament_with_matches():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)
    matchmaking_repo.get_matches_by_tournament.return_value = [
        {"id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None}
    ]

    # Act
    result = await matchmaking_service.get_matches_by_tournament(1)

    # Assert
    assert len(result) == 1
    assert result[0]["player1_id"] == 1
    assert result[0]["player2_id"] == 2

@pytest.mark.asyncio
async def test_get_player_matches_no_matches():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)
    matchmaking_repo.get_player_matches.return_value = []

    # Act
    result = await matchmaking_service.get_player_matches(1)

    # Assert
    assert result == []

@pytest.mark.asyncio
async def test_get_player_matches_with_matches():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)
    matchmaking_repo.get_player_matches.return_value = [
        {"id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None},
        {"id": 2, "tournament_id": 1, "player1_id": 1, "player2_id": 3, "status": "scheduled", "winner_id": None}
    ]

    # Act
    result = await matchmaking_service.get_player_matches(1)

    # Assert
    assert len(result) == 2
    assert result[0]["player1_id"] == 1
    assert result[1]["player1_id"] == 1

@pytest.mark.asyncio
async def test_submit_match_result_http_post_fails():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Mock repository responses
    matchmaking_repo.update_match_result.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "completed", "winner_id": 1
    }
    matchmaking_repo.get_match_by_id.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None
    }

    # Mock HTTP calls to raise an HTTPStatusError on post
    mock_put_response = AsyncMock()
    mock_put_response.status_code = 200
    with patch.dict(os.environ, {"ANALYTICS_SERVICE_URL": "http://mock-analytics-service"}), \
         patch("httpx.AsyncClient.put", return_value=mock_put_response) as mock_put, \
         patch("httpx.AsyncClient.post", side_effect=httpx.HTTPStatusError("Error", request=None, response=None)) as mock_post:
        
        # Act & Assert
        with pytest.raises(ValueError, match="Error updating match result: Error"):
            await matchmaking_service.submit_match_result(1, 1)

        # Ensure the put and post calls were attempted
        mock_put.assert_called_once()
        mock_post.assert_called()


@pytest.mark.asyncio
async def test_submit_match_result_match_not_found():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Simulate match not found
    matchmaking_repo.update_match_result.return_value = None
    
    # Act & Assert
    with pytest.raises(ValueError, match="Match with id 1 not found"):
        await matchmaking_service.submit_match_result(1, 1)

@pytest.mark.asyncio
async def test_submit_match_result_http_post_fails():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Mock database responses
    matchmaking_repo.update_match_result.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "completed", "winner_id": 1
    }
    matchmaking_repo.get_match_by_id.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None
    }

    # Mock HTTP calls to raise an HTTPStatusError on post
    mock_put_response = AsyncMock()
    mock_put_response.status_code = 200
    with patch("httpx.AsyncClient.put", return_value=mock_put_response) as mock_put, \
         patch("httpx.AsyncClient.post", side_effect=httpx.HTTPStatusError("Error", request=None, response=None)) as mock_post:
        
        # Act & Assert
        with pytest.raises(ValueError, match="Error updating match result: Error"):
            await matchmaking_service.submit_match_result(1, 1)

        # Ensure the put and post calls were attempted
        mock_put.assert_called_once()
        mock_post.assert_called()

@pytest.mark.asyncio
async def test_submit_match_result_generic_exception():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)
    
    matchmaking_repo.update_match_result.side_effect = Exception("Unexpected error")
    
    # Act & Assert
    with pytest.raises(ValueError, match="Error updating match result: Unexpected error"):
        await matchmaking_service.submit_match_result(1, 1)
