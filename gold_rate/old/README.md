# Daily Gold Rate Fetcher - Gleestar

This application fetches daily gold rates from Anandabazar and displays them in a beautiful poster format.

## Features

- **Daily Rate Fetching**: Automatically fetches the latest gold rates from Anandabazar website
- **Smart Caching**: Uses localStorage to cache rates for the day, reducing server requests
- **Daily Auto-Refresh**: Automatically updates at midnight with new rates
- **Fallback Mechanism**: Shows default rates if the server is unavailable
- **Beautiful UI**: Responsive design with trend indicators

## Project Structure

```
gold_rate/
├── index.html        # Main HTML page
├── script.js         # Frontend logic with caching
├── style.css         # Styling
├── server.js         # Backend server for scraping
├── package.json      # Node.js dependencies
└── README.md         # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```
   cd c:\Users\deepa\Downloads\gold_rate
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Start the Backend Server

1. Open a terminal in the project directory
2. Run:
   ```
   npm start
   ```

   You should see:
   ```
   Server running at http://localhost:3000
   Rates will be fetched on first request and cached for 24 hours
   ```

### Open the Application

1. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

2. The application will:
   - Display today's date
   - Fetch gold rates from Anandabazar
   - Cache the rates for 24 hours
   - Automatically refresh at midnight

## How It Works

### Backend (server.js)

- Scrapes the Anandabazar gold price page using Cheerio
- Extracts 22K and 24K gold prices
- Caches rates for 24 hours in memory
- Serves rates via REST API at `/api/gold-rates`

### Frontend (script.js)

1. **First Load**:
   - Checks if rates are cached for today in localStorage
   - If not cached, fetches from backend server
   - Caches the fetched rates with today's date

2. **Subsequent Loads**:
   - Uses cached rates from localStorage
   - No new server requests made

3. **Daily Refresh**:
   - Automatically refreshes at midnight
   - Clears cache and fetches fresh rates
   - Cleans up old cache entries (older than 3 days)

## API Endpoints

### GET /api/gold-rates

Returns the current gold rates

**Response:**
```json
{
    "success": true,
    "data": {
        "k22_1g": 14995,
        "k22_10g": 149950,
        "k24_1g": 15780,
        "k24_10g": 157800,
        "fetchedAt": "2026-05-28T10:30:00.000Z"
    }
}
```

## Features Explained

### Rate Caching
- Rates are stored in browser localStorage with the date as key
- Format: `goldRates_YYYY-MM-DD`
- Prevents redundant requests on the same day

### Auto-Refresh
- Automatically fetches new rates at midnight
- User doesn't need to refresh the page
- Old cache entries (3+ days old) are automatically cleaned

### Fallback Rates
- If server is unavailable, shows default rates
- Ensures the app always displays something
- Helps during development/testing

## Troubleshooting

### "Backend server not responding"

**Solution:**
1. Make sure you've run `npm start` in another terminal
2. Check if the server is running at `http://localhost:3000`
3. Check for any error messages in the server terminal

### Rates not updating

**Solution:**
1. Clear browser cache and localStorage
2. Hard refresh (Ctrl+F5)
3. Open browser console (F12) to check for errors

### Server crashes with error

**Solution:**
1. Make sure all dependencies are installed: `npm install`
2. Check Node.js version: `node --version`
3. Try again: `npm start`

## Development

### Running in Development Mode

```
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Modifying Scraper Logic

Edit `server.js` to adjust:
- Which website is scraped
- Which selectors to use for extracting prices
- Cache duration
- Error handling

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported

## Notes

- The application requires internet connection to fetch rates initially
- Rates are cached locally, so subsequent visits don't require internet
- The application uses localStorage which requires cookies enabled

## License

This project is for educational purposes.

## Contact

For issues or questions, check the console logs or review the server output for debugging information.
