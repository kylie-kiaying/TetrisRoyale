import os
import logging
from dotenv import load_dotenv
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler
from app.bot.handlers import start, view_tournaments, view_profile, register_tournament, tournament_callback, link_account, unlink_account

# Load environment variables
load_dotenv()
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

def main():
    # Create application
    application = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    # Add command handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CommandHandler('link', link_account))
    application.add_handler(CommandHandler('unlink', unlink_account))
    application.add_handler(CommandHandler('tournaments', view_tournaments))
    application.add_handler(CommandHandler('profile', view_profile))
    application.add_handler(CommandHandler('register', register_tournament))
    
    # Add callback query handler for inline buttons
    application.add_handler(CallbackQueryHandler(tournament_callback))

    # Start the bot
    application.run_polling()

if __name__ == '__main__':
    main()