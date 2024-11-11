import pytest
from unittest.mock import AsyncMock, Mock
from app.service.analytics_service import AnalyticsService
from app.schema.analytics_schema import PlayerStatisticsCreate, PlayerStatisticsResponse, PlayerStatisticsUpdate
from fastapi import HTTPException

@pytest.mark.asyncio
async def test_update_statistics():
    # Arrange
    mock_repository = Mock()
    mock_repository.update_statistics = AsyncMock()
    service = AnalyticsService(mock_repository)

    player_id = 1
    tournament_id = 1
    match_id = 1
    update_data = PlayerStatisticsUpdate(
        pieces_placed=55,
        pps=1.2,
        kpp=2.0,
        apm=100,
        finesse_percentage="85%",
        lines_cleared=20
    )
    expected_response = PlayerStatisticsResponse(
        id=1,
        player_id=player_id,
        match_id=match_id,
        tournament_id=tournament_id,
        pieces_placed=55,
        pps=1.2,
        kpp=2.0,
        apm=100,
        finesse_percentage="85%",
        lines_cleared=20
    )

    mock_repository.update_statistics.return_value = expected_response

    # Act
    result = await service.update_statistics(player_id, tournament_id, match_id, update_data)

    # Assert
    assert result == expected_response
    mock_repository.update_statistics.assert_called_once_with(
        player_id, tournament_id, match_id, update_data.dict(exclude_unset=True)
    )

@pytest.mark.asyncio
async def test_get_player_statistics():
    # Arrange
    mock_repository = Mock()
    mock_repository.get_statistics_by_player = AsyncMock()
    service = AnalyticsService(mock_repository)

    player_id = 1
    expected_statistics = [PlayerStatisticsResponse(id=1, player_id=1, match_id=1, tournament_id=1, pieces_placed=50, pps=1.5, kpp=2.1, apm=120, finesse_percentage="90%", lines_cleared=10)]
    mock_repository.get_statistics_by_player.return_value = expected_statistics

    # Act
    result = await service.get_player_statistics(player_id)

    # Assert
    assert result == expected_statistics
    mock_repository.get_statistics_by_player.assert_called_once_with(player_id)

@pytest.mark.asyncio
async def test_update_statistics():
    # Arrange
    mock_repository = Mock()
    mock_repository.update_statistics = AsyncMock()
    service = AnalyticsService(mock_repository)

    player_id = 1
    tournament_id = 1
    match_id = 1
    update_data = PlayerStatisticsUpdate(
        pieces_placed=55,
        pps=1.2,
        kpp=2.0,
        apm=100,
        finesse_percentage="85%",
        lines_cleared=20
    )
    expected_response = PlayerStatisticsResponse(id=1, player_id=1, match_id=1, tournament_id=1, pieces_placed=55, pps=1.5, kpp=2.1, apm=120, finesse_percentage="90%", lines_cleared=10)
    mock_repository.update_statistics.return_value = expected_response

    # Act
    result = await service.update_statistics(player_id, tournament_id, match_id, update_data)

    # Assert
    assert result == expected_response
    mock_repository.update_statistics.assert_called_once_with(player_id, tournament_id, match_id, update_data.dict(exclude_unset=True))

@pytest.mark.asyncio
async def test_delete_statistics():
    # Arrange
    mock_repository = Mock()
    mock_repository.delete_statistics = AsyncMock(return_value=True)
    service = AnalyticsService(mock_repository)

    player_id = 1
    tournament_id = 1
    match_id = 1

    # Act
    result = await service.delete_statistics(player_id, tournament_id, match_id)

    # Assert
    assert result is True
    mock_repository.delete_statistics.assert_called_once_with(player_id, tournament_id, match_id)

@pytest.mark.asyncio
async def test_create_statistics_raises_exception():
    # Arrange
    mock_repository = Mock()
    mock_repository.create_statistics = AsyncMock(side_effect=Exception("Database error"))
    service = AnalyticsService(mock_repository)

    stat_data = PlayerStatisticsCreate(
        player_id=1,
        match_id=1,
        tournament_id=1,
        pieces_placed=50,
        pps=1.5,
        kpp=2.1,
        apm=120,
        finesse_percentage="90%",
        lines_cleared=10
    )

    # Act & Assert
    with pytest.raises(Exception) as exc_info:
        await service.create_statistics(stat_data)
    
    assert str(exc_info.value) == "Database error"

@pytest.mark.asyncio
async def test_get_player_statistics_no_data():
    # Arrange
    mock_repository = Mock()
    mock_repository.get_statistics_by_player = AsyncMock(return_value=[])
    service = AnalyticsService(mock_repository)

    player_id = 999  # Use an ID that doesn't exist

    # Act
    result = await service.get_player_statistics(player_id)

    # Assert
    assert result == []
    mock_repository.get_statistics_by_player.assert_called_once_with(player_id)



@pytest.mark.asyncio
async def test_update_statistics_not_found():
    # Arrange
    mock_repository = Mock()
    mock_repository.update_statistics = AsyncMock(return_value=None)
    service = AnalyticsService(mock_repository)

    player_id = 1
    tournament_id = 1
    match_id = 1
    update_data = PlayerStatisticsUpdate(
        player_id = 1,
        tournament_id = 1,
        match_id = 1,
        pieces_placed=55,
        pps=1.2,
        kpp=2.0,
        apm=100,
        finesse_percentage="85%",
        lines_cleared=20
    )

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await service.update_statistics(player_id, tournament_id, match_id, update_data)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Statistics not found"
    mock_repository.update_statistics.assert_called_once_with(player_id, tournament_id, match_id, update_data.dict(exclude_unset=True))

@pytest.mark.asyncio
async def test_delete_statistics_not_found():
    # Arrange
    mock_repository = Mock()
    mock_repository.delete_statistics = AsyncMock(return_value=False)
    service = AnalyticsService(mock_repository)

    player_id = 1
    tournament_id = 1
    match_id = 1

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await service.delete_statistics(player_id, tournament_id, match_id)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Statistics not found"
    mock_repository.delete_statistics.assert_called_once_with(player_id, tournament_id, match_id)

@pytest.mark.asyncio
async def test_get_tournament_statistics_no_data():
    # Arrange
    mock_repository = Mock()
    mock_repository.get_statistics_by_tournament = AsyncMock(return_value=[])
    service = AnalyticsService(mock_repository)

    tournament_id = 999  # Use an ID that doesn't exist

    # Act
    result = await service.get_tournament_statistics(tournament_id)

    # Assert
    assert result == []
    mock_repository.get_statistics_by_tournament.assert_called_once_with(tournament_id)

@pytest.mark.asyncio
async def test_get_player_statistics_multiple_entries():
    # Arrange
    mock_repository = Mock()
    mock_repository.get_statistics_by_player = AsyncMock()
    service = AnalyticsService(mock_repository)

    player_id = 1
    stats = [
        PlayerStatisticsResponse(id=1, player_id=1, match_id=1, tournament_id=1, pieces_placed=50, pps=1.5, kpp=2.1, apm=120, finesse_percentage="90%", lines_cleared=10),
        PlayerStatisticsResponse(id=2, player_id=1, match_id=2, tournament_id=1, pieces_placed=45, pps=1.3, kpp=2.0, apm=110, finesse_percentage="85%", lines_cleared=8)
    ]
    mock_repository.get_statistics_by_player.return_value = stats

    # Act
    result = await service.get_player_statistics(player_id)

    # Assert
    assert result == stats
    mock_repository.get_statistics_by_player.assert_called_once_with(player_id)
    