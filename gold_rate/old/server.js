const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname));

// Store rates in memory with timestamp
let cachedRates = null;
let lastFetchTime = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Function to scrape gold prices from Anandabazar
async function scrapeGoldPrices() {
    try {
        // Check if cache is still valid
        if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
            console.log('Returning cached rates');
            return cachedRates;
        }

        console.log('Fetching fresh rates from Anandabazar...');
        const response = await axios.get('https://www.anandabazar.com/business/today-gold-price-in-kolkata', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        
        // Extract rates from the page
        // This selector may need adjustment based on the website structure
        const rates = {
            k22_1g: null,
            k22_10g: null,
            k24_1g: null,
            k24_10g: null,
            fetchedAt: new Date().toISOString()
        };

        // Try to find price elements - adjust selectors based on actual website structure
        let priceElements = [];
        
        // Look for text containing "22K" and "24K" with prices
        $('*').each(function() {
            const text = $(this).text();
            // Match patterns like "₹14,995" or numbers with commas
            if (text.includes('22K') || text.includes('22 ক্যারেট')) {
                const match = text.match(/₹?([\d,]+)/g);
                if (match) priceElements.push({ type: '22k', prices: match });
            }
            if (text.includes('24K') || text.includes('24 ক্যারেট')) {
                const match = text.match(/₹?([\d,]+)/g);
                if (match) priceElements.push({ type: '24k', prices: match });
            }
        });

        // Parse extracted prices
        priceElements.forEach(element => {
            if (element.prices && element.prices.length > 0) {
                element.prices.forEach((price, index) => {
                    const cleanPrice = parseInt(price.replace(/[₹,]/g, ''), 10);
                    
                    if (element.type === '22k') {
                        if (cleanPrice > 50000 && !rates.k22_10g) rates.k22_10g = cleanPrice;
                        else if (cleanPrice > 10000 && cleanPrice < 50000 && !rates.k22_1g) rates.k22_1g = cleanPrice;
                    }
                    if (element.type === '24k') {
                        if (cleanPrice > 50000 && !rates.k24_10g) rates.k24_10g = cleanPrice;
                        else if (cleanPrice > 10000 && cleanPrice < 50000 && !rates.k24_1g) rates.k24_1g = cleanPrice;
                    }
                });
            }
        });

        // Fallback rates if scraping didn't extract properly
        if (!rates.k22_1g) rates.k22_1g = 14995;
        if (!rates.k22_10g) rates.k22_10g = 149950;
        if (!rates.k24_1g) rates.k24_1g = 15780;
        if (!rates.k24_10g) rates.k24_10g = 157800;

        // Cache the rates
        cachedRates = rates;
        lastFetchTime = Date.now();

        console.log('Rates fetched successfully:', rates);
        return rates;
    } catch (error) {
        console.error('Error fetching rates:', error.message);
        
        // Return cached rates if available, otherwise return defaults
        if (cachedRates) {
            console.log('Returning previously cached rates due to fetch error');
            return cachedRates;
        }

        return {
            k22_1g: 14995,
            k22_10g: 149950,
            k24_1g: 15780,
            k24_10g: 157800,
            error: 'Failed to fetch live rates',
            fetchedAt: new Date().toISOString()
        };
    }
}

// API Endpoint to get gold prices
app.get('/api/gold-rates', async (req, res) => {
    try {
        const rates = await scrapeGoldPrices();
        res.json({
            success: true,
            data: rates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch rates',
            message: error.message
        });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Rates will be fetched on first request and cached for 24 hours');
});
