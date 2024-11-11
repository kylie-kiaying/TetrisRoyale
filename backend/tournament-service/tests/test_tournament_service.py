import pytest
from unittest.mock import AsyncMock, MagicMock
from app.service.tournament_service import TournamentService
from datetime import datetime
from zoneinfo import ZoneInfo

@pytest.fixture
def tournament_repository():
    # Mocking the TournamentRepository with AsyncMock
    return AsyncMock()

@pytest.fixture
def tournament_service(tournament_repository):
    # Creating a service instance with a mocked repository
    return TournamentService(tournament_repository)

# 1. Test: Create Tournament
@pytest.mark.asyncio
async def test_create_tournament(tournament_service, tournament_repository):
    data = {
        "tournament_name": "Championship",
        "tournament_start": datetime(2024, 5, 1, tzinfo=ZoneInfo("UTC")),
        "tournament_end": datetime(2024, 5, 5, tzinfo=ZoneInfo("UTC")),
        "status": "upcoming",
        "remarks": "Annual event",
        "recommended_rating": 1500,
        "organiser": "Sports League"
    }
    tournament_repository.create_tournament.return_value = data  # Mocking response
    
    result = await tournament_service.create_tournament(data)
    
    tournament_repository.create_tournament.assert_called_once()
    assert result == data

# 2. Test: Get Tournament (success case)
@pytest.mark.asyncio
async def test_get_tournament_success(tournament_service, tournament_repository):
    tournament_id = 1
    mock_tournament = {"tournament_id": tournament_id, "tournament_name": "Championship"}
    tournament_repository.get_tournament_by_id.return_value = mock_tournament
    
    result = await tournament_service.get_tournament(tournament_id)
    
    tournament_repository.get_tournament_by_id.assert_called_once_with(tournament_id)
    assert result == mock_tournament

# 3. Test: Get Tournament (failure case)
@pytest.mark.asyncio
async def test_get_tournament_not_found(tournament_service, tournament_repository):
    tournament_id = 1
    tournament_repository.get_tournament_by_id.return_value = None
    
    with pytest.raises(ValueError, match="Tournament not found"):
        await tournament_service.get_tournament(tournament_id)

class MockTournament:
    def __init__(self, **entries):
        self.__dict__.update(entries)

# 4. Test: Update Tournament
@pytest.mark.asyncio
async def test_update_tournament(tournament_service, tournament_repository):
    tournament_id = 1
    data = {"tournament_name": "New Championship"}
    existing_tournament = MockTournament(tournament_id=tournament_id, tournament_name="Old Championship")
    tournament_repository.get_tournament_by_id.return_value = existing_tournament
    updated_tournament = MockTournament(tournament_id=tournament_id, tournament_name="New Championship")
    tournament_repository.update_tournament.return_value = updated_tournament
    
    result = await tournament_service.update_tournament(tournament_id, data)
    
    tournament_repository.update_tournament.assert_called_once()
    assert result.tournament_name == "New Championship"

# 5. Test: Delete Tournament
@pytest.mark.asyncio
async def test_delete_tournament(tournament_service, tournament_repository):
    tournament_id = 1
    tournament_repository.get_tournament_by_id.return_value = {"tournament_id": tournament_id}
    tournament_repository.delete_tournament.return_value = {"detail": "Tournament deleted successfully"}
    
    result = await tournament_service.delete_tournament(tournament_id)
    
    tournament_repository.delete_tournament.assert_called_once()
    assert result == {"detail": "Tournament deleted successfully"}

# 6. Test: Register Player
@pytest.mark.asyncio
async def test_register_player(tournament_service, tournament_repository):
    tournament_id = 1
    player_id = 123
    mock_tournament = {"tournament_id": tournament_id}
    tournament_repository.get_tournament_by_id.return_value = mock_tournament
    tournament_repository.register_player.return_value = {"player_id": player_id, "tournament_id": tournament_id}
    
    result = await tournament_service.register_player(tournament_id, player_id)
    
    tournament_repository.register_player.assert_called_once()
    assert result == {"player_id": player_id, "tournament_id": tournament_id}

# 7. Test: Delete Registrant (Not Found)
@pytest.mark.asyncio
async def test_delete_registrant_not_found(tournament_service, tournament_repository):
    tournament_id = 1
    player_id = 123
    tournament_repository.get_registrant_by_tournament_and_player.return_value = None
    
    with pytest.raises(ValueError, match="Registrant not found"):
        await tournament_service.delete_registrant(tournament_id, player_id)

# Test: Create Tournament with invalid data (missing required fields)
@pytest.mark.asyncio
async def test_create_tournament_missing_data(tournament_service, tournament_repository):
    data = {
        "tournament_name": "",  # Missing necessary fields or incorrect data
    }
    tournament_repository.create_tournament.side_effect = ValueError("Invalid data provided")

    with pytest.raises(ValueError, match="Invalid data provided"):
        await tournament_service.create_tournament(data)

# Test: Update Tournament with missing tournament ID
@pytest.mark.asyncio
async def test_update_tournament_missing_id(tournament_service, tournament_repository):
    tournament_id = 9999  # Assuming this ID doesn't exist
    data = {"tournament_name": "Nonexistent Tournament"}
    tournament_repository.get_tournament_by_id.return_value = None

    with pytest.raises(ValueError, match="Tournament not found"):
        await tournament_service.update_tournament(tournament_id, data)

# Test: Delete Tournament that doesn’t exist
@pytest.mark.asyncio
async def test_delete_tournament_not_found(tournament_service, tournament_repository):
    tournament_id = 9999  # Nonexistent ID
    tournament_repository.get_tournament_by_id.return_value = None

    with pytest.raises(ValueError, match="Tournament not found"):
        await tournament_service.delete_tournament(tournament_id)

# Test: Register Player for a non-existent tournament
@pytest.mark.asyncio
async def test_register_player_tournament_not_found(tournament_service, tournament_repository):
    tournament_id = 9999  # Nonexistent ID
    player_id = 123
    tournament_repository.get_tournament_by_id.return_value = None

    with pytest.raises(ValueError, match="Tournament not found"):
        await tournament_service.register_player(tournament_id, player_id)

# Test: Get Tournament Matches (non-existent tournament)
@pytest.mark.asyncio
async def test_get_tournament_matches_not_found(tournament_service, tournament_repository):
    tournament_id = 9999  # Nonexistent ID
    tournament_repository.get_tournament_matches.side_effect = ValueError("Tournament not found")

    with pytest.raises(ValueError, match="Tournament not found"):
        await tournament_service.get_tournament_matches(tournament_id)

# Test: Register Player already registered in Tournament
@pytest.mark.asyncio
async def test_register_player_already_registered(tournament_service, tournament_repository):
    tournament_id = 1
    player_id = 123
    mock_tournament = {"tournament_id": tournament_id}
    tournament_repository.get_tournament_by_id.return_value = mock_tournament
    tournament_repository.register_player.side_effect = ValueError("Player already registered")

    with pytest.raises(ValueError, match="Player already registered"):
        await tournament_service.register_player(tournament_id, player_id)

# Test: Update Registrant with non-existent tournament and player
@pytest.mark.asyncio
async def test_update_registrant_not_found(tournament_service, tournament_repository):
    tournament_id = 1
    player_id = 123
    new_player_id = 456
    tournament_repository.get_registrant_by_tournament_and_player.return_value = None

    with pytest.raises(ValueError, match="Registrant not found"):
        await tournament_service.update_registrant(tournament_id, player_id, new_player_id)

# Test: Delete Registrant for a player not in tournament
@pytest.mark.asyncio
async def test_delete_registrant_not_in_tournament(tournament_service, tournament_repository):
    tournament_id = 1
    player_id = 123
    tournament_repository.get_registrant_by_tournament_and_player.return_value = None

    with pytest.raises(ValueError, match="Registrant not found"):
        await tournament_service.delete_registrant(tournament_id, player_id)

# Test: List all tournaments when no tournaments are available
@pytest.mark.asyncio
async def test_list_tournaments_empty(tournament_service, tournament_repository):
    tournament_repository.list_tournaments.return_value = []

    result = await tournament_service.list_tournaments()
    assert result == []