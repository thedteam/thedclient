document.addEventListener('DOMContentLoaded', function() {
    // ========== CONFIGURATION FOR LIVE SERVER ==========
    // Update this with your live server API endpoint
    const API_ENDPOINT = 'https://your-live-server.com/api/gold-rates'; // Replace with your live server URL

    // 1. Update Today's Date in Poster format
    const dateElement = document.getElementById('poster-date');
    if (dateElement) {
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-GB', options).toUpperCase();
        dateElement.textContent = formattedDate;
    }

    // 2. Get today's and yesterday's date keys for localStorage
    const getTodayKey = () => {
        const today = new Date().toISOString().split('T')[0];
        return `goldRates_${today}`;
    };

    const getYesterdayKey = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        return `goldRates_${yesterdayStr}`;
    };

    // 3. Function to clean old cache entries
    function cleanOldCache() {
        const keys = Object.keys(localStorage);
        const today = new Date();
        const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        keys.forEach(key => {
            if (key.startsWith('goldRates_')) {
                const dateStr = key.replace('goldRates_', '');
                if (dateStr < threeDaysAgo) {
                    localStorage.removeItem(key);
                    console.log('Cleaned old cache:', key);
                }
            }
        });
    }

    // 4. Extract numeric value from rate string (e.g., "₹14,995" -> 14995)
    function extractNumericRate(rateString) {
        return parseInt(rateString.replace(/₹|,/g, ''), 10);
    }

    // 5. Determine trend by comparing rates
    function determineTrend(currentRate, previousRate) {
        if (!previousRate) return 'down'; // Default to down for first-time display
        
        const current = extractNumericRate(currentRate);
        const previous = extractNumericRate(previousRate);
        
        if (current > previous) return 'up';
        if (current < previous) return 'down';
        return 'neutral';
    }

    // 6. Fetch and Cache Gold Prices with Daily Updates
    async function fetchAndScrapeGoldPrices() {
        try {
            const todayKey = getTodayKey();
            const cachedData = localStorage.getItem(todayKey);

            // If we have cached data for today, use it
            if (cachedData) {
                console.log('Using cached rates for today');
                const rates = JSON.parse(cachedData);
                updatePosterRates(rates);
                return;
            }

            console.log("Fetching live rates from API...");
            
            // Fetch from live server API
            const response = await fetch(API_ENDPOINT);
            
            if (!response.ok) {
                throw new Error("API server not responding");
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                const rates = result.data;
                const formattedRates = {
                    k22_1g: '₹' + rates.k22_1g.toLocaleString('en-IN'),
                    k22_10g: '₹' + (rates.k22_1g * 10).toLocaleString('en-IN'),
                    k24_1g: '₹' + rates.k24_1g.toLocaleString('en-IN'),
                    k24_10g: '₹' + (rates.k24_1g * 10).toLocaleString('en-IN'),
                    fetchedAt: rates.fetchedAt
                };

                // Cache the rates for today
                localStorage.setItem(todayKey, JSON.stringify(formattedRates));
                
                // Clear old cache entries
                cleanOldCache();
                
                updatePosterRates(formattedRates);
                console.log('Rates fetched and cached successfully');
            } else {
                throw new Error(result.error || 'Invalid response format');
            }

        } catch (error) {
            console.error('Error fetching from API:', error.message);
            console.warn('Using default fallback rates...');
            
            // Use fallback rates
            const fallbackRates = {
                k22_1g: '₹14,995',
                k22_10g: '₹1,49,950',
                k24_1g: '₹15,780',
                k24_10g: '₹1,57,800'
            };
            updatePosterRates(fallbackRates);
        }
    }

    // Function to update the actual DOM elements with given rates and dynamic trends
    function updatePosterRates(rates) {
        // Elements for 22K and 24K
        const k22_1g_Element = document.getElementById('rate-22k-1g');
        const k22_10g_Element = document.getElementById('rate-22k-10g');
        const k24_1g_Element = document.getElementById('rate-24k-1g');
        const k24_10g_Element = document.getElementById('rate-24k-10g');

        // Check if elements exist before updating
        if (k22_1g_Element && k22_10g_Element && k24_1g_Element && k24_10g_Element) {
            // Get previous day's rates for trend comparison
            const yesterdayKey = getYesterdayKey();
            const previousData = localStorage.getItem(yesterdayKey);
            const previousRates = previousData ? JSON.parse(previousData) : null;

            // Determine trends based on rate comparison
            const trend22k = determineTrend(rates.k22_1g, previousRates?.k22_1g);
            const trend24k = determineTrend(rates.k24_1g, previousRates?.k24_1g);

            // Update content with rate values and trend arrows
            k22_1g_Element.innerHTML = `${rates.k22_1g}<span class="trend-arrow ${trend22k}"></span>`;
            k22_10g_Element.innerHTML = `${rates.k22_10g}<span class="trend-arrow ${trend22k}"></span>`;
            k24_1g_Element.innerHTML = `${rates.k24_1g}<span class="trend-arrow ${trend24k}"></span>`;
            k24_10g_Element.innerHTML = `${rates.k24_10g}<span class="trend-arrow ${trend24k}"></span>`;
            
            console.log("DOM updated with gold rates and dynamic trends");
            console.log("22K Trend:", trend22k, "| 24K Trend:", trend24k);
        } else {
            console.error("One or more gold rate display elements not found in index.html.");
        }
    }

    // Call the function to fetch rates and update the display
    fetchAndScrapeGoldPrices();

    // Set up auto-refresh at midnight
    function scheduleNextUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        console.log(`Next rate update scheduled in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
        
        setTimeout(() => {
            localStorage.removeItem(getTodayKey());
            fetchAndScrapeGoldPrices();
            scheduleNextUpdate();
        }, timeUntilMidnight);
    }

    scheduleNextUpdate();

    // 7. Gold Coins Falling Animation Setup
    function createFallingCoins() {
        const container = document.createElement('div');
        container.className = 'coin-container';
        document.body.appendChild(container);

        const numCoins = 35; // Number of coins to animate
        for (let i = 0; i < numCoins; i++) {
            const coin = document.createElement('div');
            coin.className = 'coin';
            
            // Randomize coin appearance and animation
            const size = Math.random() * 20 + 15; // Size between 15px and 35px
            const left = Math.random() * 100; // Position 0% to 100% width
            const duration = Math.random() * 6 + 4; // Fall duration 4s to 10s
            const delay = Math.random() * 10; // Start delay
            
            coin.style.width = `${size}px`;
            coin.style.height = `${size}px`;
            coin.style.left = `${left}vw`;
            coin.style.animationDuration = `${duration}s`;
            coin.style.animationDelay = `-${delay}s`; // Negative delay so some coins are immediately visible on load
            
            container.appendChild(coin);
        }
    }

    createFallingCoins();

    // Action Buttons Logic
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const posterNode = document.querySelector('.poster-wrapper');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (typeof html2canvas !== 'undefined') {
                html2canvas(posterNode, { scale: 2 }).then(canvas => {
                    // Get today's date for filename
                    const today = new Date();
                    const day = String(today.getDate()).padStart(2, '0');
                    const month = today.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
                    const year = today.getFullYear();
                    const dateStr = `${day}-${month}-${year}`;
                    
                    const link = document.createElement('a');
                    link.download = `Gleestar-Gold-Rate-${dateStr}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            } else {
                console.error("html2canvas library is not loaded.");
            }
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            try {
                if (typeof html2canvas === 'undefined') {
                    alert('html2canvas library not loaded. Please reload the page.');
                    return;
                }

                // Generate canvas
                const canvas = await html2canvas(posterNode, { scale: 2 });
                
                // Convert canvas to blob
                canvas.toBlob(async (blob) => {
                    try {
                        if (!blob) {
                            console.error('Failed to create blob from canvas');
                            alert('Failed to prepare image for sharing.');
                            return;
                        }

                        const file = new File([blob], 'Gleestar-Gold-Rate.png', { type: 'image/png' });
                        
                        // Get today's date for caption
                        const today = new Date();
                        const options = { day: 'numeric', month: 'long', year: 'numeric' };
                        const formattedDate = today.toLocaleDateString('en-GB', options).toUpperCase();
                        const shareCaption = `Gleestar Gold Rates - ${formattedDate}\n\nCheck out today's gold rates at Gleestar Bengaluru!`;
                        
                        if (!navigator.share) {
                            throw new Error('Web Share API not supported on this connection/device');
                        }

                        // Check if device can share files
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                title: 'Gleestar Gold Rate',
                                text: shareCaption,
                                files: [file]
                            });
                        } else {
                            // Fallback: share without file (text only)
                            await navigator.share({
                                title: 'Gleestar Gold Rate',
                                text: shareCaption
                            });
                        }
                        console.log('Share successful');
                    } catch (error) {
                        console.error('Error in share blob callback:', error);
                        if (error.name !== 'AbortError') {
                            alert('Direct sharing is not supported on this browser or connection. Downloading the image instead...');
                            if (downloadBtn) downloadBtn.click();
                        }
                    }
                }, 'image/png');
            } catch (error) {
                console.error('Error preparing share:', error);
                alert('Failed to prepare image for sharing. Error: ' + error.message);
            }
        });
    }

    // 8. Real Visitor Count Tracker
    function trackVisitor() {
        // Extract base URL from API_ENDPOINT to connect to the right backend automatically
        const baseUrl = API_ENDPOINT.replace('/api/gold-rates', '');
        const visitorUrl = `${baseUrl}/api/visitor`;
        
        // Create visitor badge element dynamically
        const visitorDiv = document.createElement('div');
        visitorDiv.className = 'visitor-counter';
        visitorDiv.innerHTML = `<span id="v-count">...</span> Visitors`;
        document.body.appendChild(visitorDiv);

        // Fetch and update visitor count
        fetch(visitorUrl)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('v-count').innerText = data.count.toLocaleString();
                }
            })
            .catch(err => console.error('Error fetching visitor count:', err));
    }

    trackVisitor();
});
