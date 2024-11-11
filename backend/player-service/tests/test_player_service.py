import pytest
from unittest.mock import AsyncMock
from fastapi import HTTPException
from datetime import datetime, timezone
from app.service.player_service import PlayerService
from app.repository.player_repository import PlayerRepository
from app.schema.player_schema import PlayerCreate, PlayerUpdate, PlayerResponse, PlayerAvailabilityUpdate, PlayerStatistics

@pytest.mark.asyncio
async def test_get_all_players():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.get_all_players.return_value = [
        AsyncMock(user_id=1, username="player1", email="player1@example.com", rating=1200, profile_picture=None, availability_status="available", date_created=datetime.now(timezone.utc), last_updated=datetime.now(timezone.utc)),
        AsyncMock(user_id=2, username="player2", email="player2@example.com", rating=1300, profile_picture=None, availability_status="busy", date_created=datetime.now(timezone.utc), last_updated=datetime.now(timezone.utc))
    ]
    
    player_service = PlayerService(player_repo)

    # Act
    players = await player_service.get_all_players()

    # Assert
    assert len(players) == 2
    assert players[0].username == "player1"
    assert players[1].username == "player2"
    player_repo.get_all_players.assert_called_once()

@pytest.mark.asyncio
async def test_create_player_success():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_data = PlayerCreate(user_id=1, username="newplayer", email="newplayer@example.com")
    
    player_repo.create_player.return_value = AsyncMock(
        user_id=1, username="newplayer", email="newplayer@example.com", rating=1200, profile_picture=None, availability_status="available", date_created=datetime.now(timezone.utc), last_updated=datetime.now(timezone.utc)
    )

    player_service = PlayerService(player_repo)

    # Act
    new_player = await player_service.create_player(player_data)

    # Assert
    assert new_player.username == "newplayer"
    assert new_player.email == "newplayer@example.com"
    player_repo.create_player.assert_called_once_with(player_data)

@pytest.mark.asyncio
async def test_create_player_failure():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_data = PlayerCreate(user_id=1, username="newplayer", email="newplayer@example.com")
    
    player_repo.create_player.side_effect = ValueError("Invalid data")
    
    player_service = PlayerService(player_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await player_service.create_player(player_data)
    
    assert exc_info.value.status_code == 400
    assert str(exc_info.value.detail) == "Invalid data"

@pytest.mark.asyncio
async def test_get_player_success():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.get_player_by_id.return_value = AsyncMock(
        user_id=1, username="player1", email="player1@example.com", rating=1200, profile_picture=None, availability_status="available", date_created=datetime.now(timezone.utc), last_updated=datetime.now(timezone.utc)
    )
    
    player_service = PlayerService(player_repo)

    # Act
    player = await player_service.get_player(1)

    # Assert
    assert player.username == "player1"
    assert player.email == "player1@example.com"
    player_repo.get_player_by_id.assert_called_once_with(1)

@pytest.mark.asyncio
async def test_get_player_not_found():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.get_player_by_id.return_value = None
    
    player_service = PlayerService(player_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await player_service.get_player(1)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Player not found"

@pytest.mark.asyncio
async def test_update_player_success():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_update = PlayerUpdate(username="updatedplayer", email="updated@example.com")
    
    player_repo.update_player.return_value = AsyncMock(
        user_id=1, username="updatedplayer", email="updated@example.com", profile_picture=None, availability_status="available", date_created=datetime.now(timezone.utc), last_updated=datetime.now(timezone.utc)
    )

    player_service = PlayerService(player_repo)

    # Act
    updated_player = await player_service.update_player(1, player_update)

    # Assert
    assert updated_player.username == "updatedplayer"
    assert updated_player.email == "updated@example.com"
    player_repo.update_player.assert_called_once_with(1, player_update)

@pytest.mark.asyncio
async def test_update_player_not_found():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_update = PlayerUpdate(username="updatedplayer", email="updated@example.com")
    
    player_repo.update_player.return_value = None
    
    player_service = PlayerService(player_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await player_service.update_player(1, player_update)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Player not found"

@pytest.mark.asyncio
async def test_update_availability_success():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    availability_update = PlayerAvailabilityUpdate(availability_status="busy")
    
    player_repo.update_availability.return_value = AsyncMock(
        user_id=1, username="player1", availability_status="busy", profile_picture=None, email="player1@example.com"
    )
    
    player_service = PlayerService(player_repo)

    # Act
    updated_player = await player_service.update_availability(1, availability_update)

    # Assert
    assert updated_player.availability_status == "busy"
    player_repo.update_availability.assert_called_once_with(1, "busy")

@pytest.mark.asyncio
async def test_delete_player_success():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.delete_player.return_value = True
    
    player_service = PlayerService(player_repo)

    # Act
    result = await player_service.delete_player(1)

    # Assert
    assert result is True
    player_repo.delete_player.assert_called_once_with(1)

@pytest.mark.asyncio
async def test_delete_player_not_found():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.delete_player.return_value = False
    
    player_service = PlayerService(player_repo)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await player_service.delete_player(1)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Player not found"

@pytest.mark.asyncio
async def test_get_player_statistics():
    # Arrange
    player_repo = AsyncMock(PlayerRepository)
    player_repo.get_player_by_id.return_value = AsyncMock(
        user_id=1, match_history=[
            {"match_id": 1, "opponent_id": 2, "result": "win", "date": datetime.now(timezone.utc)},
            {"match_id": 2, "opponent_id": 3, "result": "loss", "date": datetime.now(timezone.utc)}
        ]
    )
    
    player_service = PlayerService(player_repo)

    # Act
    statistics = await player_service.get_player_statistics(1)

    # Assert
    assert statistics.matches_played == 2
    assert statistics.matches_won == 1
    player_repo.get_player_by_id.assert_called_once_with(1)
