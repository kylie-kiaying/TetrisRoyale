import pytest
from unittest.mock import AsyncMock, MagicMock, Mock
from app.controller.ratings_controller import (
    create_tournament_match,
    update_match_scores,
    delete_match,
    add_player,
    get_all_player_ratings,
    get_player_rating,
)
from app.schema.schemas import MatchCreate, MatchUpdate

@pytest.mark.asyncio
async def test_create_tournament_match():
    db = AsyncMock()
    db.add = AsyncMock()
    db.commit = AsyncMock()
    db.refresh = AsyncMock()

    match_data = MatchCreate(
        id=1,
        player1_id=1,
        player2_id=2,
        status="scheduled",
        scheduled_at="2024-12-01T00:00:00",
        tournament_id=1,
    )

    # Mock `get_player_by_id` to return valid players
    get_player_by_id_mock = AsyncMock(return_value=True)
    
    # Mock db execute to return the desired result
    mock_result = Mock()
    mock_result.scalars.return_value.first.return_value = True  # Simulate a successful player fetch
    db.execute.return_value = mock_result

    response = await create_tournament_match(match_data, db)
    
    # Assertions
    assert response == {"message": "Tournament match created successfully", "match_id": match_data.id}
    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_update_match_scores():
    db = AsyncMock()
    db.commit = AsyncMock()

    # Set up the match with the initial state
    match = MagicMock()
    db.get.return_value = match

    # Mock db.execute for players and matches in calculate_ratings
    mock_players_result = Mock()
    mock_matches_result = Mock()

    # Mock return values for `scalars().all()` chain in calculate_ratings
    mock_players_result.scalars.return_value.all.return_value = [MagicMock(id=1, rating=900)]
    mock_matches_result.scalars.return_value.all.return_value = [MagicMock(id=1)]

    # Set up the execute method to return players first, then matches
    db.execute.side_effect = [mock_players_result, mock_matches_result]

    # Prepare update data for match scores
    update_data = MatchUpdate(
        player1_id=1,
        player2_id=2,
        status="completed",
        scheduled_at="2024-12-01T00:00:00",
        tournament_id=1,
        player1_score=10,
        player2_score=5,
    )

    # Run the update function
    response = await update_match_scores(1, update_data, db)
    
    # Assertions
    assert response == {"message": "Match updated and ratings recalculated"}
    assert match.player1_score == 10
    assert match.player2_score == 5
    assert match.status == "completed"

@pytest.mark.asyncio
async def test_delete_match():
    db = AsyncMock()
    db.commit = AsyncMock()
    db.delete = AsyncMock()  # Ensure delete is AsyncMock

    # Mock the match retrieval
    match = MagicMock()
    db.get.return_value = match

    # Mock db.execute for players and matches in calculate_ratings
    mock_players_result = Mock()
    mock_matches_result = Mock()

    # Mock return values for `scalars().all()` chain in calculate_ratings
    mock_players_result.scalars.return_value.all.return_value = [MagicMock(id=1, rating=900)]
    mock_matches_result.scalars.return_value.all.return_value = [MagicMock(id=1)]

    # Set up the execute method to return players first, then matches
    db.execute.side_effect = [mock_players_result, mock_matches_result]

    # Run the delete function
    response = await delete_match(1, db)
    
    # Assertions
    assert response == {"message": "Match deleted and ratings recalculated"}
    db.delete.assert_called_once_with(match)

@pytest.mark.asyncio
async def test_add_player():
    db = AsyncMock()
    db.get.return_value = None  # Mock player does not exist
    db.commit = AsyncMock()

    response = await add_player(1, "test_player", db)
    assert response == {"message": "Player added successfully to the rating database"}
    db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_get_all_player_ratings():
    db = AsyncMock()
    mock_player = MagicMock(id=1, username="test_player", rating=900)
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = [mock_player]
    db.execute.return_value = mock_result

    response = await get_all_player_ratings(db)
    assert isinstance(response, list)
    assert len(response) == 1
    assert response[0]["player_id"] == mock_player.id
    assert response[0]["username"] == mock_player.username
    assert response[0]["rating"] == mock_player.rating  # Rating adjustment logic

@pytest.mark.asyncio
async def test_get_player_rating():
    db = AsyncMock()
    mock_player = MagicMock(id=1, username="test_player", rating=900)
    db.get.return_value = mock_player

    response = await get_player_rating(1, db)
    assert response == {
        "player_id": mock_player.id,
        "username": mock_player.username,
        "rating": max(0, mock_player.rating),
    }
