import pytest
from unittest.mock import AsyncMock
from sqlalchemy.ext.asyncio import AsyncSession
from app.repository.tournament_repository import TournamentRepository
from app.model.tournament_model import Tournament, Registrant
from datetime import datetime, timezone

@pytest.mark.asyncio
async def test_get_tournament_by_id():
    # Arrange
    mock_session = AsyncMock(AsyncSession)
    tournament_repo = TournamentRepository(mock_session)

    mock_tournament = Tournament(tournament_id=1, tournament_name="Test Tournament", tournament_start=datetime.now(timezone.utc),
                                 tournament_end=datetime.now(timezone.utc), status="upcoming")

    mock_session.execute.return_value.scalar_one_or_none.return_value = mock_tournament

    # Act
    result = await (await tournament_repo.get_tournament_by_id(1))

    # Assert
    assert result.tournament_name == "Test Tournament"
    mock_session.execute.assert_called_once()

@pytest.mark.asyncio
async def test_create_tournament():
    # Arrange
    mock_session = AsyncMock(AsyncSession)
    tournament_repo = TournamentRepository(mock_session)

    mock_tournament = Tournament(tournament_id=1, tournament_name="New Tournament", tournament_start=datetime.now(timezone.utc),
                                 tournament_end=datetime.now(timezone.utc), status="upcoming")

    # Mock the refresh method to return the mock_tournament
    mock_session.refresh.return_value = mock_tournament
    # Mock the get_tournament_by_id method to return the mock_tournament
    tournament_repo.get_tournament_by_id = AsyncMock(return_value=mock_tournament)

    # Act
    result = await tournament_repo.create_tournament(mock_tournament)

    # Assert
    assert result.tournament_name == "New Tournament"
    assert result.status == "upcoming"
    mock_session.add.assert_called_once_with(mock_tournament)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(mock_tournament)
    tournament_repo.get_tournament_by_id.assert_called_once_with(mock_tournament.tournament_id)


@pytest.mark.asyncio
async def test_update_tournament():
    # Arrange
    mock_session = AsyncMock(AsyncSession)
    tournament_repo = TournamentRepository(mock_session)

    mock_tournament = Tournament(tournament_id=1, tournament_name="Updated Tournament", tournament_start=datetime.now(timezone.utc),
                                 tournament_end=datetime.now(timezone.utc), status="upcoming")

    # Mock the refresh method to return the mock_tournament
    mock_session.refresh.return_value = mock_tournament
    # Mock the get_tournament_by_id method to return the mock_tournament
    tournament_repo.get_tournament_by_id = AsyncMock(return_value=mock_tournament)

    # Act
    result = await tournament_repo.update_tournament(mock_tournament)

    # Assert
    assert result.tournament_name == "Updated Tournament"
    assert result.status == "upcoming"
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(mock_tournament)
    tournament_repo.get_tournament_by_id.assert_called_once_with(mock_tournament.tournament_id)

@pytest.mark.asyncio
async def test_delete_tournament():
    # Arrange
    mock_session = AsyncMock(AsyncSession)
    tournament_repo = TournamentRepository(mock_session)

    mock_tournament = Tournament(tournament_id=1, tournament_name="Test Tournament")

    # Act
    await tournament_repo.delete_tournament(mock_tournament)

    # Assert
    mock_session.delete.assert_called_once_with(mock_tournament)
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_register_player():
    # Arrange
    mock_session = AsyncMock(AsyncSession)
    tournament_repo = TournamentRepository(mock_session)

    mock_registrant = Registrant(player_id=1, tournament_id=1)

    # Act
    result = await tournament_repo.register_player(mock_registrant)

    # Assert
    assert result.player_id == 1
    mock_session.add.assert_called_once_with(mock_registrant)
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(mock_registrant)
