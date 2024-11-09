from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from app.services.tournament_service import TournamentService
from app.services.player_service import PlayerService
from sqlalchemy import select
from app.utils.db import AsyncSessionLocal
from app.model.telegram_user import TelegramUser

tournament_service = TournamentService()
player_service = PlayerService()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(
        f"Welcome {user.first_name} to TetrisTracker Bot! 🎮\n\n"
        "To use this bot, you need to have a TetrisTracker account. "
        "Please register at our website first.\n\n"
        "Available commands:\n"
        "/link <player_id> - Link your Telegram account with TetrisTracker\n"
        "/unlink - Unlink your Telegram account from TetrisTracker\n"
        "/tournaments - View available tournaments\n"
        "/profile - View your profile and rating\n"
        "/register <tournament_id> - Register for a tournament"
    )

async def link_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text(
            "Please provide your TetrisTracker player ID.\n"
            "Usage: /link <player_id>"
        )
        return

    try:
        player_id = int(context.args[0])
        telegram_id = update.effective_user.id
        username = update.effective_user.username
        
        async with AsyncSessionLocal() as session:
            # Check if user already exists
            result = await session.execute(
                select(TelegramUser).where(TelegramUser.telegram_id == telegram_id)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                await update.message.reply_text("Your Telegram account is already linked!")
                return
            
            # Create new user
            new_user = TelegramUser(
                telegram_id=telegram_id,
                player_id=player_id,
                username=username
            )
            session.add(new_user)
            await session.commit()
        
        await update.message.reply_text(
            "Successfully linked your Telegram account with TetrisTracker!"
        )
    except ValueError:
        await update.message.reply_text("Invalid player ID. Please provide a number.")
    except Exception as e:
        print(f"Error linking account: {e}")
        await update.message.reply_text("Failed to link account. Please try again later.")

async def view_tournaments(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tournaments = await tournament_service.get_tournaments()
    
    if not tournaments:
        await update.message.reply_text("No tournaments available at the moment.")
        return

    # Send each tournament as a separate message with its own keyboard
    for tournament in tournaments:
        keyboard = [[InlineKeyboardButton(
            "Register", 
            callback_data=f"register_{tournament['tournament_id']}"
        )]]
        
        message = (
            f"🏆 {tournament['tournament_name']}\n"
            f"📅 {tournament['tournament_start']} - {tournament['tournament_end']}\n"
            f"📊 Recommended Rating: {tournament['recommended_rating']}\n"
            f"ID: {tournament['tournament_id']}\n"
        )
        
        await update.message.reply_text(
            message,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )

async def view_profile(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id
    
    try:
        # First get the player_id from telegram_users table
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(TelegramUser).where(TelegramUser.telegram_id == telegram_id)
            )
            telegram_user = result.scalar_one_or_none()
            
            if not telegram_user:
                await update.message.reply_text("Please link your account first using /link <player_id>")
                return

        # Now get the player info using the player_id
        player = await player_service.get_player(telegram_user.player_id)
        if player:
            message = (
                f"🎮 Profile Information\n\n"
                f"Username: {player['username']}\n"
                f"Rating: {player['rating']}\n"
                f"Matches Played: {len(player['match_history'])}"
            )
        else:
            message = "Failed to fetch profile information. Please try again later."
            
    except Exception as e:
        print(f"Error fetching profile: {e}")
        message = "Failed to fetch profile information. Please try again later."
    
    await update.message.reply_text(message)

async def register_tournament(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text(
            "Please provide a tournament ID.\nUsage: /register <tournament_id>"
        )
        return

    tournament_id = context.args[0]
    user_id = update.effective_user.id

    try:
        result = await tournament_service.register_player(tournament_id, user_id)
        await update.message.reply_text("Successfully registered for the tournament!")
    except Exception as e:
        await update.message.reply_text(f"Registration failed: {str(e)}")

async def tournament_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data.startswith("register_"):
        tournament_id = query.data.split("_")[1]
        telegram_id = update.effective_user.id
        
        try:
            # Get player_id from telegram_users table
            async with AsyncSessionLocal() as session:
                result = await session.execute(
                    select(TelegramUser).where(TelegramUser.telegram_id == telegram_id)
                )
                telegram_user = result.scalar_one_or_none()
                
                if not telegram_user:
                    await query.edit_message_text("Please link your account first using /link <player_id>")
                    return
                
                await tournament_service.register_player(tournament_id, telegram_user.player_id)
                await query.edit_message_text("Successfully registered for the tournament!")
        except Exception as e:
            print(f"Registration error: {e}")
            await query.edit_message_text(f"Registration failed. Please try again later.")

async def unlink_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id
    
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(TelegramUser).where(TelegramUser.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()
            
            if not user:
                await update.message.reply_text("Your account is not linked!")
                return
            
            await session.delete(user)
            await session.commit()
            
            await update.message.reply_text("Successfully unlinked your account!")
    except Exception as e:
        print(f"Error unlinking account: {e}")
        await update.message.reply_text("Failed to unlink account. Please try again later.")