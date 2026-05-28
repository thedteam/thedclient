# Quick Start Guide

## What's New

Your gold rate application now has:

✅ **Backend Server** (server.js) - Fetches rates from Anandabazar safely
✅ **Smart Caching** - Rates cached daily in browser storage  
✅ **Auto-Refresh** - Updates automatically at midnight
✅ **Error Handling** - Fallback rates when server is down

---

## Setup (5 minutes)

### Step 1: Install Dependencies
```
npm install
```

This installs: express, axios, cheerio, cors

### Step 2: Start the Server
```
npm start
```

You'll see:
```
Server running at http://localhost:3000
Rates will be fetched on first request and cached for 24 hours
```

### Step 3: Open in Browser
```
http://localhost:3000
```

Done! The app will:
- Display today's date automatically
- Fetch gold rates from Anandabazar
- Cache them for 24 hours
- Show rates on every page load (from cache)
- Auto-refresh tomorrow at midnight

---

## How to Keep It Running

**Option 1: Keep Terminal Open**
- Leave the `npm start` terminal running
- Rates update automatically at midnight

**Option 2: Run as Background Service**
- On Windows: Use Task Scheduler to run `npm start` on startup
- On Mac/Linux: Use PM2 or systemd

---

## Features Explained

### Daily Caching
- First visit: Fetches from website (takes ~2-3 seconds)
- Subsequent visits same day: Instant (from cache)
- Tomorrow: Fresh rates fetched at midnight

### Automatic Refresh
- At midnight, app clears cache automatically
- No user action needed
- Next page load fetches fresh rates

### Smart Error Handling
- Server down? Shows fallback rates
- No internet? Uses cached rates from yesterday
- Always shows something to the user

---

## Testing

1. **Check Console Logs** (F12):
   - Shows "Using cached rates for today"
   - Shows "Rates fetched and cached successfully"
   - Shows "Next rate update scheduled in X minutes"

2. **Test Caching**:
   - Refresh page → Should use cache (instant)
   - Clear localStorage → Refreshes from server

3. **Test Tomorrow's Update**:
   - Check browser console at midnight
   - Should see "Next rate update scheduled..."

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Backend server not responding" | Run `npm start` in another terminal |
| Rates not showing | Check browser console (F12) for errors |
| App very slow | Make sure server is running |
| Rates stuck same day | Clear localStorage in browser DevTools |

---

## File Structure

```
index.html      → Display page (no changes needed)
style.css       → Styling (no changes needed)  
script.js       → Frontend (NEW - fetches from backend, caches locally)
server.js       → Backend (NEW - scrapes Anandabazar)
package.json    → Dependencies (NEW)
.gitignore      → Git config (NEW)
README.md       → Full documentation (NEW)
```

---

## Next Steps

1. **Run it**: `npm start`
2. **Open**: `http://localhost:3000`
3. **Test**: Refresh page - should cache
4. **Verify**: Check console for cache messages

---

## Need to Customize?

### Change Update Time
In `script.js`, modify the `scheduleNextUpdate()` function to change the refresh time from midnight.

### Change Website/Rates Source
In `server.js`, modify the URL and selectors to scrape different data.

### Change Cache Duration
In `server.js`, change `CACHE_DURATION = 24 * 60 * 60 * 1000` to different value.

---

## Tips

- ✅ Keep server running in background  
- ✅ Check console logs for debugging
- ✅ Use browser DevTools to clear cache if needed
- ✅ Server automatically handles CORS - no issues!
- ✅ Rates update once per day - efficient!

---

**You're all set! Start the server and enjoy daily gold rates!** 🎉
