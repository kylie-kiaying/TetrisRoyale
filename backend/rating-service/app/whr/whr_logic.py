from whr import Base, Evaluate

def calculate_whr(players, matches):
    """
    Calculate WHR ratings for players using the match history.
    Args:
        players (list): List of Player objects from the database.
        matches (list): List of Match objects.
    Returns:
        dict: Player ID to updated rating.
    """
    # Initialize the WHR model (use Base or Evaluate as appropriate)
    whr_model = Base()  # or Evaluate() if this is the correct class


    for match in matches:
        # Convert the match timestamp to a Unix timestamp (or whatever int format is expected)
        match_time = int(match.timestamp.timestamp())  # Example conversion
        whr_model.create_game(
            str(match.player1_id),  # Ensure these are strings
            str(match.player2_id),
            'B' if match.player1_score == 1 else 'W',  # Ensure winner is also a string
            match_time
        )

    # Calculate ratings (assuming an appropriate method is available)
    whr_model.iterate_until_converge()  # Adjust if a different method is needed

    updated_ratings = {
        str(player.id): whr_model.ratings_for_player(str(player.id))  # Ensure this is a string
        for player in players
    }
    print(updated_ratings)
    return updated_ratings
