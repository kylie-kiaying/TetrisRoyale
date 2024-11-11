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

async def test_pair_players_success(matchmaking_service):
    # Arrange
    matchmaking_service.tournament_repository.get_tournament_registrants.return_value = [1, 2, 3, 4]
    
    # Create a mock response with awaitable methods
    mock_response = AsyncMock()
    mock_response.json.return_value = {"rating": 1200}
    mock_response.raise_for_status = AsyncMock()
    
    # Mock the httpx client get method
    with patch('httpx.AsyncClient.get', return_value=mock_response) as mock_get:
        # Act
        result = await matchmaking_service.pair_players(1)
        
        # Assert
        assert len(result) == 2
        # Each match should contain [tournament_id, player1_id, player1_rating, player2_id, player2_rating]
        assert len(result[0]) == 5
        assert len(result[1]) == 5
        
        # Verify the players were paired correctly
        assert result[0][1] == 1  # First match, player1_id
        assert result[0][3] == 2  # First match, player2_id
        assert result[1][1] == 3  # Second match, player1_id
        assert result[1][3] == 4  # Second match, player2_id
        
        # Verify all players have the mocked rating
        assert result[0][2] == 1200  # First match, player1_rating
        assert result[0][4] == 1200  # First match, player2_rating
        assert result[1][2] == 1200  # Second match, player1_rating
        assert result[1][4] == 1200  # Second match, player2_rating
        
        # Verify the get method was called for each player
        assert mock_get.call_count == 4


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

    # Mock updating the match result and getting match details
    matchmaking_repo.update_match_result.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "completed", "winner_id": 1
    }
    matchmaking_repo.get_match_by_id.return_value = {
        "id": 1, "tournament_id": 1, "player1_id": 1, "player2_id": 2, "status": "scheduled", "winner_id": None
    }

    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Mock the httpx AsyncClient.put request
    mock_response = AsyncMock()
    mock_response.status_code = 200

    with patch('httpx.AsyncClient.put', return_value=mock_response) as mock_put, \
         patch("httpx.AsyncClient.post", new=AsyncMock()) as mock_post:
        # Act
        result = await matchmaking_service.submit_match_result(1, 1)

        # Assert
        assert result["status"] == "completed"
        assert result["winner_id"] == 1
        
        # Ensure URL and JSON match the actual service implementation
        mock_put.assert_called_once_with(
            'http://rating-service:8000/matches/1/',
            json={
                "tournament_id": None,
                "player1_id": None,
                "player2_id": None,
                "scheduled_at": None,
                "status": "completed",
                "player1_score": 1,
                "player2_score": 0
            }
        )
        matchmaking_repo.update_match_result.assert_called_once_with(1, 1)


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
async def test_pair_players_success():
    # Arrange
    matchmaking_repo = AsyncMock(MatchmakingRepository)
    tournament_repo = AsyncMock(TournamentRepository)
    matchmaking_service = MatchmakingService(matchmaking_repo, tournament_repo)

    # Mock data and HTTP responses
    tournament_repo.get_tournament_registrants.return_value = [1, 2, 3, 4]
    mock_response = AsyncMock()
    mock_response.json.return_value = {"rating": 1200}
    with patch('httpx.AsyncClient.get', return_value=mock_response):
        # Act
        result = await matchmaking_service.pair_players(1)

        # Assert
        assert len(result) == 2
        assert result[0][1] == 1
        assert result[0][3] == 2
        assert result[1][1] == 3
        assert result[1][3] == 4

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
