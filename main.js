// ====================================
// API Configuration
// ====================================
// No API keys needed - using public NSE endpoints and Google News RSS

// CORS proxy for NSE API calls (NSE doesn't support CORS from browser)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// NSE Sector Index Mappings
const NSE_SECTOR_INDICES = {
    'Information Technology': 'NIFTY IT',
    'Financials': 'NIFTY FINANCIAL SERVICES',
    'Energy': 'NIFTY ENERGY',
    'Consumer Discretionary': 'NIFTY AUTO',
    'Health Care': 'NIFTY PHARMA',
    'Industrials': 'NIFTY INFRASTRUCTURE',
    'Consumer Staples': 'NIFTY FMCG',
    'Materials': 'NIFTY METAL',
    'Communication Services': 'NIFTY MEDIA',
    'Utilities': 'NIFTY PSU BANK',
    'Real Estate': 'NIFTY REALTY',
};

// ====================================
// Global State
// ====================================
const state = {
    selectedSector: null,
    selectedCompany: null,
    sectorData: null,
    companiesData: [],
    newsData: [],
};

// ====================================
// Indian Stock Sector Mappings
// ====================================
// Map sectors to representative Indian companies (NSE symbols)
const INDIAN_SECTOR_COMPANIES = {
    'Information Technology': ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'],
    'Financials': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK'],
    'Energy': ['RELIANCE', 'ONGC', 'BPCL', 'IOC', 'NTPC'],
    'Consumer Discretionary': ['MARUTI', 'BAJAJ-AUTO', 'TITAN', 'TATAMOTORS'],
    'Health Care': ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'APOLLOHOSP'],
    'Industrials': ['LT', 'ULTRACEMCO', 'ADANIENT', 'SIEMENS'],
    'Consumer Staples': ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA'],
    'Materials': ['TATASTEEL', 'HINDALCO', 'JSWSTEEL', 'VEDL'],
    'Communication Services': ['BHARTIARTL', 'SAIL'],
    'Utilities': ['POWERGRID', 'NTPC'],
    'Real Estate': ['DLF', 'GODREJPROP'],
};

// Company name mappings for display
const COMPANY_NAMES = {
    'TCS': 'Tata Consultancy Services',
    'INFY': 'Infosys Ltd',
    'WIPRO': 'Wipro Ltd',
    'HCLTECH': 'HCL Technologies',
    'TECHM': 'Tech Mahindra',
    'HDFCBANK': 'HDFC Bank',
    'ICICIBANK': 'ICICI Bank',
    'SBIN': 'State Bank of India',
    'AXISBANK': 'Axis Bank',
    'KOTAKBANK': 'Kotak Mahindra Bank',
    'RELIANCE': 'Reliance Industries',
    'ONGC': 'Oil & Natural Gas Corp',
    'BPCL': 'Bharat Petroleum',
    'IOC': 'Indian Oil Corporation',
    'NTPC': 'NTPC Ltd',
    'MARUTI': 'Maruti Suzuki',
    'BAJAJ-AUTO': 'Bajaj Auto',
    'TITAN': 'Titan Company',
    'TATAMOTORS': 'Tata Motors',
    'SUNPHARMA': 'Sun Pharmaceutical',
    'DRREDDY': 'Dr. Reddy\'s Laboratories',
    'CIPLA': 'Cipla Ltd',
    'APOLLOHOSP': 'Apollo Hospitals',
    'LT': 'Larsen & Toubro',
    'ULTRACEMCO': 'UltraTech Cement',
    'ADANIENT': 'Adani Enterprises',
    'SIEMENS': 'Siemens Ltd',
    'ITC': 'ITC Ltd',
    'HINDUNILVR': 'Hindustan Unilever',
    'NESTLEIND': 'Nestle India',
    'BRITANNIA': 'Britannia Industries',
    'TATASTEEL': 'Tata Steel',
    'HINDALCO': 'Hindalco Industries',
    'JSWSTEEL': 'JSW Steel',
    'VEDL': 'Vedanta Ltd',
    'BHARTIARTL': 'Bharti Airtel',
    'SAIL': 'SAIL',
    'POWERGRID': 'Power Grid Corp',
    'DLF': 'DLF Ltd',
    'GODREJPROP': 'Godrej Properties',
};

// ====================================
// Utility Functions
// ====================================
function checkAPIKeys() {
    // No API keys needed anymore - hide the notice
    const notice = document.getElementById('configNotice');
    if (notice) {
        notice.style.display = 'none';
    }
    return true;
}

function formatCurrency(value) {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(value);
}

function formatNumber(value) {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(value);
}

function formatPercentage(value) {
    if (!value && value !== 0) return 'N/A';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

function analyzeSentiment(text) {
    const positiveWords = ['gain', 'profit', 'growth', 'surge', 'rally', 'boost', 'strong', 'positive', 'up', 'rise', 'success', 'record', 'high'];
    const negativeWords = ['loss', 'decline', 'fall', 'crash', 'weak', 'negative', 'down', 'drop', 'concern', 'risk', 'low', 'warning'];

    const lowerText = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
        if (lowerText.includes(word)) score++;
    });

    negativeWords.forEach(word => {
        if (lowerText.includes(word)) score--;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

// ====================================
// API Functions
// ====================================

// Fetch Sector Performance Data from NSE
async function fetchSectorData() {
    try {
        const results = [];

        for (const [sector, indexName] of Object.entries(NSE_SECTOR_INDICES)) {
            try {
                const nseUrl = `https://www.nseindia.com/api/equity-stockIndices?index=${encodeURIComponent(indexName)}`;
                const url = CORS_PROXY + encodeURIComponent(nseUrl);

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    console.warn(`Failed to fetch ${indexName}`);
                    results.push({ name: sector, performance: 0 });
                    continue;
                }

                const data = await response.json();

                // Extract performance from first data item
                const perf = data.data && data.data.length > 0
                    ? parseFloat(data.data[0].pChange || 0)
                    : 0;

                results.push({ name: sector, performance: perf });

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`Error fetching ${sector}:`, error);
                results.push({ name: sector, performance: 0 });
            }
        }

        return results;
    } catch (error) {
        console.error('Error fetching sector data:', error);
        throw error;
    }
}

// Fetch Company Quote Data from NSE
async function fetchCompanyQuote(symbol) {
    try {
        const cleanSymbol = symbol.replace('.BSE', '');
        const nseUrl = `https://www.nseindia.com/api/quote-equity?symbol=${cleanSymbol}`;
        const url = CORS_PROXY + encodeURIComponent(nseUrl);

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            console.warn(`Failed to fetch data for ${symbol}`);
            return null;
        }

        const data = await response.json();

        // Check for valid data
        if (!data.priceInfo) {
            console.warn(`No price data available for ${symbol}`);
            return null;
        }

        const priceInfo = data.priceInfo || {};
        const metadata = data.metadata || {};

        return {
            symbol: cleanSymbol,
            name: COMPANY_NAMES[cleanSymbol] || cleanSymbol,
            price: parseFloat(priceInfo.lastPrice) || 0,
            change: parseFloat(priceInfo.change) || 0,
            changePercent: parseFloat(priceInfo.pChange) || 0,
            volume: parseInt(priceInfo.totalTradedVolume) || 0,
            high: parseFloat(priceInfo.intraDayHighLow?.max) || 0,
            low: parseFloat(priceInfo.intraDayHighLow?.min) || 0,
            previousClose: parseFloat(priceInfo.previousClose) || 0,
            peRatio: parseFloat(metadata.pdSymbolPe) || 0,
            weekHigh: parseFloat(priceInfo.weekHighLow?.max) || 0,
            weekLow: parseFloat(priceInfo.weekHighLow?.min) || 0,
        };
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
}

// Fetch News Data from Google News RSS
async function fetchNews(query) {
    try {
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' stock india')}&hl=en-IN&gl=IN&ceid=IN:en`;
        const url = CORS_PROXY + encodeURIComponent(feedUrl);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch news');

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');

        const items = doc.querySelectorAll('item');

        return Array.from(items).slice(0, 10).map(item => {
            const title = item.querySelector('title')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            const source = item.querySelector('source')?.textContent || 'Google News';

            return {
                title: title,
                description: description,
                url: link,
                source: source,
                publishedAt: pubDate,
                imageUrl: null, // RSS feeds don't typically include images
                sentiment: analyzeSentiment(title + ' ' + description),
            };
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

// ====================================
// UI Rendering Functions
// ====================================

// Render Sector Overview
function renderSectorData(sectors) {
    const grid = document.getElementById('sectorGrid');
    grid.innerHTML = '';

    sectors.forEach(sector => {
        const card = document.createElement('div');
        card.className = 'sector-card';
        if (state.selectedSector === sector.name) {
            card.classList.add('selected');
        }

        const performanceClass = sector.performance >= 0 ? 'positive' : 'negative';

        card.innerHTML = `
            <div class="sector-name">${sector.name}</div>
            <div class="sector-performance ${performanceClass}">${formatPercentage(sector.performance)}</div>
            <div class="sector-label">Performance</div>
        `;

        card.addEventListener('click', () => selectSector(sector.name));
        grid.appendChild(card);
    });
}

// Render Companies
function renderCompanies(companies) {
    const grid = document.getElementById('companiesGrid');
    grid.innerHTML = '';

    const validCompanies = companies.filter(c => c !== null);

    if (validCompanies.length === 0) {
        grid.innerHTML = '<div class="placeholder">No company data available. This may be due to API limitations.</div>';
        return;
    }

    validCompanies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'company-card';
        if (state.selectedCompany?.symbol === company.symbol) {
            card.classList.add('selected');
        }

        const changeClass = company.changePercent >= 0 ? 'positive' : 'negative';

        card.innerHTML = `
            <div class="company-info">
                <h3>
                    ${company.name}
                    <span class="company-symbol">${company.symbol}</span>
                </h3>
                <div class="company-metrics">
                    <div class="metric">
                        <div class="metric-label">Volume</div>
                        <div class="metric-value">${formatNumber(company.volume)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">High</div>
                        <div class="metric-value">${formatCurrency(company.high)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Low</div>
                        <div class="metric-value">${formatCurrency(company.low)}</div>
                    </div>
                </div>
            </div>
            <div class="company-price">
                <div class="price">${formatCurrency(company.price)}</div>
                <div class="price-change ${changeClass}">${formatPercentage(company.changePercent)}</div>
            </div>
        `;

        card.addEventListener('click', () => selectCompany(company));
        grid.appendChild(card);
    });
}

// Render News
function renderNews(articles) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';

    if (articles.length === 0) {
        container.innerHTML = '<div class="placeholder">No recent news available</div>';
        return;
    }

    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-article';

        const imageHtml = article.imageUrl
            ? `<img src="${article.imageUrl}" alt="${article.title}" class="news-image" onerror="this.style.display='none'">`
            : '';

        newsCard.innerHTML = `
            <div class="news-content">
                <h4>${article.title}</h4>
                <p>${article.description || 'No description available.'}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${getTimeAgo(article.publishedAt)}</span>
                    <span class="sentiment-badge sentiment-${article.sentiment}">${article.sentiment}</span>
                    <a href="${article.url}" target="_blank" class="news-link">Read more →</a>
                </div>
            </div>
            ${imageHtml}
        `;

        container.appendChild(newsCard);
    });
}

// Render Hold/Sell Checklist
function renderChecklist(company) {
    const container = document.getElementById('checklistContainer');
    container.innerHTML = '';

    const priceChange = company.changePercent;
    const price = company.price;
    const week52High = company.weekHigh || 0;
    const week52Low = company.weekLow || 0;
    const peRatio = company.peRatio || 0;

    // Calculate metrics
    const distanceFromHigh = week52High ? ((price - week52High) / week52High * 100) : 0;
    const distanceFromLow = week52Low ? ((price - week52Low) / week52Low * 100) : 0;

    const checklist = document.createElement('div');
    checklist.innerHTML = `
        <div class="checklist-header">
            <h3>${company.name} (${company.symbol})</h3>
            <p>Analytical metrics to inform your decision-making process</p>
        </div>
        <div class="checklist-items">
            <div class="checklist-item">
                <div class="checklist-icon">📈</div>
                <div class="checklist-content">
                    <h4>Recent Price Movement</h4>
                    <p>Current change: ${formatPercentage(priceChange)}</p>
                </div>
                <div class="checklist-status ${priceChange > 5 ? 'status-positive' : priceChange < -5 ? 'status-negative' : 'status-neutral'}">
                    ${priceChange > 5 ? 'Strong Gain' : priceChange < -5 ? 'Significant Loss' : 'Stable'}
                </div>
            </div>

            <div class="checklist-item">
                <div class="checklist-icon">🎯</div>
                <div class="checklist-content">
                    <h4>52-Week High Distance</h4>
                    <p>${week52High ? `Price is ${formatPercentage(distanceFromHigh)} from 52-week high (${formatCurrency(week52High)})` : 'Data not available'}</p>
                </div>
                <div class="checklist-status ${distanceFromHigh > -10 ? 'status-positive' : distanceFromHigh < -30 ? 'status-negative' : 'status-warning'}">
                    ${distanceFromHigh > -10 ? 'Near High' : distanceFromHigh < -30 ? 'Far from High' : 'Moderate'}
                </div>
            </div>

            <div class="checklist-item">
                <div class="checklist-icon">📊</div>
                <div class="checklist-content">
                    <h4>Valuation - P/E Ratio</h4>
                    <p>${peRatio ? `Current P/E: ${peRatio.toFixed(2)}` : 'Data not available'}</p>
                </div>
                <div class="checklist-status ${peRatio > 0 && peRatio < 20 ? 'status-positive' : peRatio > 30 ? 'status-warning' : 'status-neutral'}">
                    ${peRatio > 0 && peRatio < 20 ? 'Fair Value' : peRatio > 30 ? 'High P/E' : 'Neutral'}
                </div>
            </div>

            <div class="checklist-item">
                <div class="checklist-icon">📉</div>
                <div class="checklist-content">
                    <h4>52-Week Low Distance</h4>
                    <p>${week52Low ? `Price is ${formatPercentage(distanceFromLow)} from 52-week low (${formatCurrency(week52Low)})` : 'Data not available'}</p>
                </div>
                <div class="checklist-status ${distanceFromLow > 50 ? 'status-positive' : distanceFromLow < 10 ? 'status-negative' : 'status-warning'}">
                    ${distanceFromLow > 50 ? 'Strong Recovery' : distanceFromLow < 10 ? 'Near Low' : 'Moderate'}
                </div>
            </div>

            <div class="checklist-item">
                <div class="checklist-icon">📰</div>
                <div class="checklist-content">
                    <h4>Recent News Sentiment</h4>
                    <p>Check the News & Sentiment section above for latest updates</p>
                </div>
                <div class="checklist-status status-neutral">
                    Review News
                </div>
            </div>
        </div>

        <div class="checklist-summary">
            <h4>📋 Summary</h4>
            <p>
                This checklist presents key metrics for <strong>${company.name}</strong>.
                Review each indicator along with recent news sentiment to make an informed decision.
                Remember: This is data for analysis purposes only and does not constitute investment advice.
                Always consult with a qualified financial advisor before making investment decisions.
            </p>
        </div>
    `;

    container.appendChild(checklist);
}

// ====================================
// Event Handlers
// ====================================

async function selectSector(sectorName) {
    state.selectedSector = sectorName;
    state.selectedCompany = null;

    // Update UI
    document.getElementById('selectedSectorName').textContent = sectorName;

    // Re-render sectors to show selection
    if (state.sectorData) {
        renderSectorData(state.sectorData);
    }

    // Clear previous data
    document.getElementById('companiesPlaceholder').style.display = 'none';
    document.getElementById('companiesGrid').innerHTML = '';
    document.getElementById('companiesLoading').style.display = 'block';

    // Clear news and checklist
    document.getElementById('newsPlaceholder').style.display = 'block';
    document.getElementById('newsContainer').innerHTML = '';
    document.getElementById('checklistPlaceholder').style.display = 'block';
    document.getElementById('checklistContainer').innerHTML = '';

    try {
        // Get companies for this sector
        const symbols = INDIAN_SECTOR_COMPANIES[sectorName] || [];

        if (symbols.length === 0) {
            throw new Error('No companies mapped for this sector');
        }

        // Fetch company data (with delay to respect API rate limits)
        const companies = [];
        for (let i = 0; i < Math.min(symbols.length, 5); i++) {
            const symbol = symbols[i];
            const quote = await fetchCompanyQuote(symbol);
            if (quote) companies.push(quote);

            // Add delay between requests to avoid rate limiting
            if (i < symbols.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        state.companiesData = companies;

        document.getElementById('companiesLoading').style.display = 'none';
        document.getElementById('companiesError').style.display = 'none';
        renderCompanies(companies);

        // Load news for sector
        await loadNewsForQuery(sectorName + ' India stocks');

    } catch (error) {
        console.error('Error loading companies:', error);
        document.getElementById('companiesLoading').style.display = 'none';
        document.getElementById('companiesError').style.display = 'block';
        document.getElementById('companiesError').textContent = `Error loading companies: ${error.message}`;
    }
}

async function selectCompany(company) {
    state.selectedCompany = company;

    // Re-render companies to show selection
    renderCompanies(state.companiesData);

    // Show loading states
    document.getElementById('checklistPlaceholder').style.display = 'none';
    document.getElementById('checklistLoading').style.display = 'block';

    document.getElementById('refreshNews').style.display = 'inline-flex';

    try {
        // Render checklist with company data (no separate overview needed)
        document.getElementById('checklistLoading').style.display = 'none';
        document.getElementById('checklistError').style.display = 'none';
        renderChecklist(company);

        // Load company-specific news
        await loadNewsForQuery(company.name + ' stock India');

    } catch (error) {
        console.error('Error loading company details:', error);
        document.getElementById('checklistLoading').style.display = 'none';
        document.getElementById('checklistError').style.display = 'block';
        document.getElementById('checklistError').textContent = `Error loading metrics: ${error.message}`;
    }
}

async function loadNewsForQuery(query) {
    document.getElementById('newsPlaceholder').style.display = 'none';
    document.getElementById('newsLoading').style.display = 'block';
    document.getElementById('newsContainer').innerHTML = '';

    try {
        const articles = await fetchNews(query);
        state.newsData = articles;

        document.getElementById('newsLoading').style.display = 'none';
        document.getElementById('newsError').style.display = 'none';
        renderNews(articles);
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('newsLoading').style.display = 'none';
        document.getElementById('newsError').style.display = 'block';
        document.getElementById('newsError').textContent = `Error loading news: ${error.message}`;
    }
}

async function loadSectorData() {
    const loading = document.getElementById('sectorLoading');
    const error = document.getElementById('sectorError');
    const grid = document.getElementById('sectorGrid');
    const btn = document.getElementById('refreshSector');

    loading.style.display = 'block';
    error.style.display = 'none';
    grid.innerHTML = '';
    if (btn) btn.disabled = true;

    try {
        if (!checkAPIKeys()) {
            throw new Error('Please configure your API keys in main.js');
        }

        const sectors = await fetchSectorData();
        state.sectorData = sectors;

        loading.style.display = 'none';
        renderSectorData(sectors);

    } catch (err) {
        console.error('Error loading sector data:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = `Error: ${err.message}`;
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function loadNews() {
    if (state.selectedCompany) {
        await loadNewsForQuery(state.selectedCompany.name + ' stock India');
    } else if (state.selectedSector) {
        await loadNewsForQuery(state.selectedSector + ' India stocks');
    }
}

// ====================================
// Theme Toggle Functionality
// ====================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Add a fun animation
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ====================================
// Initialization
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Indian Stock Sector Analysis Dashboard initialized');

    // Initialize theme toggle
    initThemeToggle();

    // Check API configuration
    checkAPIKeys();

    // Load initial sector data
    loadSectorData();
});
