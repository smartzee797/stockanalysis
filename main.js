// ====================================
// API Configuration
// ====================================
// IMPORTANT: Add your API keys here before using the dashboard
const API_KEYS = {
    ALPHA_VANTAGE: 'YOUR_ALPHA_VANTAGE_API_KEY', // Get from: https://www.alphavantage.co/support/#api-key
    NEWS_API: 'YOUR_NEWS_API_KEY', // Get from: https://newsapi.org/register
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
// Map sectors to representative Indian companies
const INDIAN_SECTOR_COMPANIES = {
    'Information Technology': ['TCS.BSE', 'INFY.BSE', 'WIPRO.BSE', 'HCLTECH.BSE', 'TECHM.BSE'],
    'Financials': ['HDFCBANK.BSE', 'ICICIBANK.BSE', 'SBIN.BSE', 'AXISBANK.BSE', 'KOTAKBANK.BSE'],
    'Energy': ['RELIANCE.BSE', 'ONGC.BSE', 'BPCL.BSE', 'IOC.BSE', 'NTPC.BSE'],
    'Consumer Discretionary': ['MARUTI.BSE', 'BAJAJ-AUTO.BSE', 'TITAN.BSE', 'TATAMOTORS.BSE'],
    'Health Care': ['SUNPHARMA.BSE', 'DRREDDY.BSE', 'CIPLA.BSE', 'APOLLOHOSP.BSE'],
    'Industrials': ['LT.BSE', 'ULTRACEMCO.BSE', 'ADANIENT.BSE', 'SIEMENS.BSE'],
    'Consumer Staples': ['ITC.BSE', 'HINDUNILVR.BSE', 'NESTLEIND.BSE', 'BRITANNIA.BSE'],
    'Materials': ['TATASTEEL.BSE', 'HINDALCO.BSE', 'JSWSTEEL.BSE', 'VEDL.BSE'],
    'Communication Services': ['BHARTIARTL.BSE', 'SAIL.BSE'],
    'Utilities': ['POWERGRID.BSE', 'NTPC.BSE'],
    'Real Estate': ['DLF.BSE', 'GODREJPROP.BSE'],
};

// Company name mappings for display
const COMPANY_NAMES = {
    'TCS.BSE': 'Tata Consultancy Services',
    'INFY.BSE': 'Infosys Ltd',
    'WIPRO.BSE': 'Wipro Ltd',
    'HCLTECH.BSE': 'HCL Technologies',
    'TECHM.BSE': 'Tech Mahindra',
    'HDFCBANK.BSE': 'HDFC Bank',
    'ICICIBANK.BSE': 'ICICI Bank',
    'SBIN.BSE': 'State Bank of India',
    'AXISBANK.BSE': 'Axis Bank',
    'KOTAKBANK.BSE': 'Kotak Mahindra Bank',
    'RELIANCE.BSE': 'Reliance Industries',
    'ONGC.BSE': 'Oil & Natural Gas Corp',
    'BPCL.BSE': 'Bharat Petroleum',
    'IOC.BSE': 'Indian Oil Corporation',
    'NTPC.BSE': 'NTPC Ltd',
    'MARUTI.BSE': 'Maruti Suzuki',
    'BAJAJ-AUTO.BSE': 'Bajaj Auto',
    'TITAN.BSE': 'Titan Company',
    'TATAMOTORS.BSE': 'Tata Motors',
    'SUNPHARMA.BSE': 'Sun Pharmaceutical',
    'DRREDDY.BSE': 'Dr. Reddy\'s Laboratories',
    'CIPLA.BSE': 'Cipla Ltd',
    'APOLLOHOSP.BSE': 'Apollo Hospitals',
    'LT.BSE': 'Larsen & Toubro',
    'ULTRACEMCO.BSE': 'UltraTech Cement',
    'ADANIENT.BSE': 'Adani Enterprises',
    'SIEMENS.BSE': 'Siemens Ltd',
    'ITC.BSE': 'ITC Ltd',
    'HINDUNILVR.BSE': 'Hindustan Unilever',
    'NESTLEIND.BSE': 'Nestle India',
    'BRITANNIA.BSE': 'Britannia Industries',
    'TATASTEEL.BSE': 'Tata Steel',
    'HINDALCO.BSE': 'Hindalco Industries',
    'JSWSTEEL.BSE': 'JSW Steel',
    'VEDL.BSE': 'Vedanta Ltd',
    'BHARTIARTL.BSE': 'Bharti Airtel',
    'SAIL.BSE': 'SAIL',
    'POWERGRID.BSE': 'Power Grid Corp',
    'DLF.BSE': 'DLF Ltd',
    'GODREJPROP.BSE': 'Godrej Properties',
};

// ====================================
// Utility Functions
// ====================================
function checkAPIKeys() {
    const hasKeys = API_KEYS.ALPHA_VANTAGE !== 'YOUR_ALPHA_VANTAGE_API_KEY' &&
                    API_KEYS.NEWS_API !== 'YOUR_NEWS_API_KEY';

    const notice = document.getElementById('configNotice');
    if (hasKeys && notice) {
        notice.style.display = 'none';
    }
    return hasKeys;
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

// Fetch Sector Performance Data
async function fetchSectorData() {
    try {
        // Note: Alpha Vantage's SECTOR endpoint provides US sector data
        // For demonstration, we'll use it and adapt for Indian context
        const url = `https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEYS.ALPHA_VANTAGE}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch sector data');

        const data = await response.json();

        // Check for API error messages
        if (data['Error Message'] || data['Note']) {
            throw new Error(data['Error Message'] || 'API rate limit reached. Please wait and try again.');
        }

        // Parse sector performance data
        const rankRealTime = data['Rank A: Real-Time Performance'];
        if (!rankRealTime) {
            throw new Error('Invalid sector data format');
        }

        // Convert to array format
        const sectors = Object.keys(rankRealTime).map(sector => ({
            name: sector,
            performance: parseFloat(rankRealTime[sector].replace('%', '')),
        }));

        return sectors;
    } catch (error) {
        console.error('Error fetching sector data:', error);
        throw error;
    }
}

// Fetch Company Quote Data
async function fetchCompanyQuote(symbol) {
    try {
        // Remove .BSE suffix for API call (Alpha Vantage uses different format)
        const cleanSymbol = symbol.replace('.BSE', '');

        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);

        const data = await response.json();

        // Check for API errors
        if (data['Error Message'] || data['Note']) {
            console.warn(`API issue for ${symbol}:`, data['Error Message'] || data['Note']);
            return null;
        }

        const quote = data['Global Quote'];
        if (!quote || Object.keys(quote).length === 0) {
            console.warn(`No data available for ${symbol}`);
            return null;
        }

        return {
            symbol: symbol,
            name: COMPANY_NAMES[symbol] || symbol,
            price: parseFloat(quote['05. price']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
            volume: parseInt(quote['06. volume']) || 0,
            high: parseFloat(quote['03. high']) || 0,
            low: parseFloat(quote['04. low']) || 0,
            previousClose: parseFloat(quote['08. previous close']) || 0,
        };
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
}

// Fetch Company Overview (for fundamentals)
async function fetchCompanyOverview(symbol) {
    try {
        const cleanSymbol = symbol.replace('.BSE', '');

        const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${cleanSymbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch overview for ${symbol}`);

        const data = await response.json();

        if (data['Error Message'] || data['Note'] || Object.keys(data).length === 0) {
            return null;
        }

        return {
            marketCap: parseInt(data['MarketCapitalization']) || 0,
            peRatio: parseFloat(data['PERatio']) || 0,
            pbRatio: parseFloat(data['PriceToBookRatio']) || 0,
            dividendYield: parseFloat(data['DividendYield']) || 0,
            eps: parseFloat(data['EPS']) || 0,
            beta: parseFloat(data['Beta']) || 0,
            week52High: parseFloat(data['52WeekHigh']) || 0,
            week52Low: parseFloat(data['52WeekLow']) || 0,
        };
    } catch (error) {
        console.error(`Error fetching overview for ${symbol}:`, error);
        return null;
    }
}

// Fetch News Data
async function fetchNews(query) {
    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEYS.NEWS_API}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(data.message || 'Failed to fetch news');
        }

        return data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage,
            sentiment: analyzeSentiment(article.title + ' ' + (article.description || '')),
        }));
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
function renderChecklist(company, overview) {
    const container = document.getElementById('checklistContainer');
    container.innerHTML = '';

    const priceChange = company.changePercent;
    const price = company.price;
    const week52High = overview?.week52High || 0;
    const week52Low = overview?.week52Low || 0;
    const peRatio = overview?.peRatio || 0;
    const pbRatio = overview?.pbRatio || 0;

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
                <div class="checklist-icon">💰</div>
                <div class="checklist-content">
                    <h4>Valuation - P/B Ratio</h4>
                    <p>${pbRatio ? `Current P/B: ${pbRatio.toFixed(2)}` : 'Data not available'}</p>
                </div>
                <div class="checklist-status ${pbRatio > 0 && pbRatio < 3 ? 'status-positive' : pbRatio > 5 ? 'status-warning' : 'status-neutral'}">
                    ${pbRatio > 0 && pbRatio < 3 ? 'Reasonable' : pbRatio > 5 ? 'High P/B' : 'Neutral'}
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
        // Fetch company overview
        const overview = await fetchCompanyOverview(company.symbol);

        // Render checklist
        document.getElementById('checklistLoading').style.display = 'none';
        document.getElementById('checklistError').style.display = 'none';
        renderChecklist(company, overview);

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
