# Live Server Deployment Guide

## Overview
This guide explains how to deploy your Gleestar Gold Rate application to a live server with dynamic rate trends.

## Key Changes Made for Live Deployment

### 1. **Removed Local Server Dependency**
- ❌ **Before**: `http://localhost:3000/api/gold-rates`
- ✅ **After**: Configurable live API endpoint

### 2. **Dynamic Arrow Trends**
The arrows now automatically show:
- 🟢 **UP Arrow (Green)**: Rates increased compared to previous day
- 🔴 **DOWN Arrow (Red)**: Rates decreased compared to previous day
- No Arrow: First time fetching or rates unchanged

### 3. **Rate Comparison Logic**
The system stores daily rates in browser's localStorage and compares:
- Today's rates vs Yesterday's rates
- Calculates if each rate (22K and 24K) went up or down
- Updates arrows accordingly

## Setup Instructions

### Step 1: Update API Endpoint
Open `script.js` and find the configuration section at the top:

```javascript
// ========== CONFIGURATION FOR LIVE SERVER ==========
// Update this with your live server API endpoint
const API_ENDPOINT = 'https://your-live-server.com/api/gold-rates';
```

Replace `https://your-live-server.com/api/gold-rates` with your actual live server endpoint.

### Step 2: Required API Response Format
Your live server API must return JSON in this format:

```json
{
  "success": true,
  "data": {
    "k22_1g": 14995,      // Numeric value (₹/gram)
    "k24_1g": 15780,      // Numeric value (₹/gram)
    "fetchedAt": "2026-05-29T10:30:00Z"
  }
}
```

**Important Notes:**
- Rates should be **numeric values** (not strings with ₹ symbol)
- The system automatically calculates 10g rates: `1g rate × 10`
- The API should provide 1 gram prices for both 22K and 24K

### Step 3: Enable CORS (if needed)
If your API is on a different domain, enable CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Step 4: Deploy Files
Upload these files to your live server:
- `index.html`
- `script.js`
- `style.css`
- `package.json` (optional, for reference)

**Do NOT upload:**
- `server.js` (local development only)
- `node_modules/` folder

### Step 5: Test on Live Server
1. Open your deployed website
2. Check browser console (F12 → Console tab) for any errors
3. Verify:
   - Rates are displaying correctly
   - Arrows match rate trends
   - Download and Share buttons work

## Cache Mechanism

The system uses browser localStorage to:
- **Cache rates daily** - Only fetches once per day
- **Compare with previous day** - For trend arrows
- **Auto-clean old data** - Removes data older than 3 days
- **Auto-refresh at midnight** - Fetches new rates at 00:00

## Troubleshooting

### Issue: "API server not responding"
- ✅ Check if `API_ENDPOINT` is correct
- ✅ Verify CORS headers are enabled
- ✅ Check browser console for detailed errors

### Issue: Arrows not showing
- ✅ First day of deployment will show no arrows (no previous data)
- ✅ After 2 days, arrows should appear based on rate changes

### Issue: Rates not updating
- ✅ Clear browser cache/localStorage
- ✅ Check if API endpoint returns correct format
- ✅ Verify the data reaches the API response

## API Integration Examples

### Example 1: If using a backend service
```bash
# Your server should expose this endpoint:
GET https://yourdomain.com/api/gold-rates

# Response:
{
  "success": true,
  "data": {
    "k22_1g": 14995,
    "k24_1g": 15780,
    "fetchedAt": "2026-05-29T10:30:00Z"
  }
}
```

### Example 2: If scraping from another site
Make sure your backend properly extracts and formats the data before sending to the client.

## SSL/HTTPS
For live deployment, always use HTTPS:
```javascript
const API_ENDPOINT = 'https://your-domain.com/api/gold-rates';
```

Mixed content (HTTPS page + HTTP API) will be blocked by browsers.

## Next Steps

1. **Update API endpoint** in script.js
2. **Test locally** with fetch URL changes
3. **Deploy to live server**
4. **Monitor browser console** for errors
5. **Verify arrow trends** after 24 hours

For questions or updates, refer to your API documentation.
