# 📊 Indian Stock Sector Analysis Dashboard

A comprehensive, client-side stock analysis dashboard specifically designed for Indian stock markets. This interactive web application helps investors and traders analyze sector performance, track company metrics, monitor news sentiment, and make informed investment decisions using a data-driven hold/sell checklist.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🌟 Features

### 1. **Sector Overview**
- Real-time sector performance tracking across 11 major sectors
- Visual performance indicators with color-coded gains/losses
- Interactive sector cards for quick navigation
- Percentage-based performance metrics

### 2. **Companies in Selected Sector**
- Representative companies from each sector (Nifty 50 and prominent stocks)
- Real-time stock prices and price changes
- Volume, High/Low data
- Click to view detailed metrics and analysis

### 3. **News & Sentiment Analysis**
- Latest news headlines from reputable sources
- Automated sentiment analysis (Positive/Negative/Neutral)
- Keyword-based sentiment detection
- Direct links to full articles
- Timestamps with relative time display

### 4. **Hold/Sell Checklist**
- Data-driven decision framework
- Key metrics including:
  - Recent price movement analysis
  - 52-week high/low distance
  - P/E Ratio (Price-to-Earnings)
  - P/B Ratio (Price-to-Book)
  - News sentiment integration
- Visual status indicators for each metric
- Comprehensive summary for informed decision-making

## 🚀 Implementation Details

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: 100% client-side (no backend required)
- **Data Sources**:
  - [Alpha Vantage API](https://www.alphavantage.co/) - Stock market data
  - [NewsAPI.org](https://newsapi.org/) - News and sentiment data
- **Styling**: Custom CSS with responsive design
- **No frameworks**: Vanilla JavaScript for maximum performance and minimal footprint

### Key Features of Implementation
- **Zero Dependencies**: No external libraries or frameworks
- **Privacy-Focused**: No data storage, no cookies, no tracking
- **Rate Limit Handling**: Built-in delays to respect API rate limits
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Performance Optimized**: Minimal load time, efficient rendering

## 📋 Prerequisites

Before using this dashboard, you'll need to obtain free API keys:

1. **Alpha Vantage API Key**
   - Visit: https://www.alphavantage.co/support/#api-key
   - Sign up for a free account
   - Copy your API key (Free tier: 25 requests/day, 5 requests/minute)

2. **NewsAPI Key**
   - Visit: https://newsapi.org/register
   - Create a free account
   - Copy your API key (Free tier: 100 requests/day)

## 🛠️ Local Setup Instructions

### Step 1: Clone or Download the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/stockanalysis.git

# Navigate to the project directory
cd stockanalysis
```

Or download the ZIP file and extract it to your preferred location.

### Step 2: Configure API Keys

1. Open `main.js` in your text editor
2. Locate the API configuration section at the top of the file:

```javascript
const API_KEYS = {
    ALPHA_VANTAGE: 'YOUR_ALPHA_VANTAGE_API_KEY',
    NEWS_API: 'YOUR_NEWS_API_KEY',
};
```

3. Replace the placeholder values with your actual API keys:

```javascript
const API_KEYS = {
    ALPHA_VANTAGE: 'your_actual_alpha_vantage_key_here',
    NEWS_API: 'your_actual_news_api_key_here',
};
```

4. Save the file

### Step 3: Run Locally

Simply open `index.html` in your web browser:

**Option A: Double-click**
- Double-click the `index.html` file
- It will open in your default browser

**Option B: Right-click**
- Right-click `index.html`
- Select "Open with" → Choose your preferred browser

**Option C: Command line**
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

**Option D: Local server (recommended for best experience)**
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## 🌐 GitHub Pages Deployment

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if not already created):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Stock analysis dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stockanalysis.git
   git push -u origin main
   ```

2. **Important**: Make sure your API keys are configured in `main.js` before pushing to GitHub. Since this is a public repository, consider using environment-specific configurations or instructions for users to add their own keys.

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top navigation bar)
3. Scroll down to **Pages** section (left sidebar under "Code and automation")
4. Under **Source**:
   - Select branch: `main`
   - Select folder: `/ (root)`
5. Click **Save**

### Step 3: Access Your Live Site

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/stockanalysis/
```

You can find the exact URL in the GitHub Pages section of your repository settings.

### Step 4: Custom Domain (Optional)

To use a custom domain:
1. In GitHub Pages settings, enter your custom domain
2. Update your domain's DNS settings to point to GitHub Pages
3. Follow [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 📱 Usage Guide

### Getting Started

1. **Open the dashboard** in your browser
2. **Initial load**: The dashboard will automatically fetch sector performance data
3. **Select a sector**: Click on any sector card to view companies in that sector
4. **View company details**: Click on a company card to see detailed metrics and the hold/sell checklist
5. **Review news**: News sentiment will automatically load for selected sectors/companies
6. **Refresh data**: Use the refresh buttons to update sector data and news

### Understanding the Metrics

**Sector Performance**
- Green (positive): Sector is gaining
- Red (negative): Sector is declining
- Percentage shows the relative performance

**Company Metrics**
- **Price**: Current trading price in INR
- **Change**: Absolute and percentage price change
- **Volume**: Number of shares traded
- **High/Low**: Intraday price range

**Hold/Sell Checklist Indicators**
- 🟢 **Positive/Strong**: Favorable metric
- 🟡 **Warning/Moderate**: Neutral or requires attention
- 🔴 **Negative/Risk**: Unfavorable metric
- ⚪ **Neutral**: Insufficient data or neutral reading

**News Sentiment**
- **Positive**: Contains favorable keywords (growth, profit, gain, etc.)
- **Negative**: Contains concerning keywords (loss, decline, fall, etc.)
- **Neutral**: Balanced or factual reporting

## ⚠️ Important Disclaimers

### Financial Advice Disclaimer
**This dashboard is for informational and educational purposes only.** It does not constitute financial advice, investment recommendations, or an offer to buy or sell securities. The data and metrics provided should not be the sole basis for any investment decision.

### Always Remember:
- Past performance does not guarantee future results
- Stock markets involve risk, including the potential loss of principal
- Consult with a qualified financial advisor before making investment decisions
- Conduct your own thorough research and due diligence
- Consider your personal financial situation, risk tolerance, and investment objectives

### API Limitations
- **Alpha Vantage Free Tier**: 25 requests per day, 5 requests per minute
- **NewsAPI Free Tier**: 100 requests per day
- Rate limits may affect real-time data availability
- Some company data may not be available due to API limitations

### Data Accuracy
- Data is sourced from third-party APIs and may have delays
- Not all Indian stocks are available through Alpha Vantage
- News sentiment is generated algorithmically and may not be 100% accurate
- Always verify critical information from official sources

## 🏗️ Project Structure

```
stockanalysis/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── main.js             # All JavaScript logic and API integrations
└── README.md           # This file
```

### File Descriptions

**index.html**
- Dashboard layout and structure
- Four main sections: Sector Overview, Companies, News, Hold/Sell Checklist
- Semantic HTML5 markup
- Accessibility considerations

**styles.css**
- Custom CSS variables for theming
- Responsive grid layouts
- Interactive card designs
- Mobile-first approach
- Smooth animations and transitions

**main.js**
- API integration functions
- Data fetching and parsing
- UI rendering logic
- Event handlers
- State management
- Error handling

## 🎯 Sector Coverage

The dashboard covers the following sectors with representative companies:

1. **Information Technology**: TCS, Infosys, Wipro, HCL Tech, Tech Mahindra
2. **Financials**: HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra
3. **Energy**: Reliance, ONGC, BPCL, IOC, NTPC
4. **Consumer Discretionary**: Maruti Suzuki, Bajaj Auto, Titan, Tata Motors
5. **Health Care**: Sun Pharma, Dr. Reddy's, Cipla, Apollo Hospitals
6. **Industrials**: L&T, UltraTech Cement, Adani Enterprises, Siemens
7. **Consumer Staples**: ITC, Hindustan Unilever, Nestle India, Britannia
8. **Materials**: Tata Steel, Hindalco, JSW Steel, Vedanta
9. **Communication Services**: Bharti Airtel, SAIL
10. **Utilities**: Power Grid, NTPC
11. **Real Estate**: DLF, Godrej Properties

## 🔧 Customization

### Adding More Companies

Edit the `INDIAN_SECTOR_COMPANIES` object in `main.js`:

```javascript
const INDIAN_SECTOR_COMPANIES = {
    'Information Technology': ['TCS.BSE', 'INFY.BSE', 'YOUR_SYMBOL.BSE'],
    // Add more sectors or companies
};
```

Don't forget to add the company name mapping:

```javascript
const COMPANY_NAMES = {
    'YOUR_SYMBOL.BSE': 'Your Company Name',
    // Add more mappings
};
```

### Modifying Sentiment Analysis

Customize the sentiment keywords in the `analyzeSentiment()` function:

```javascript
const positiveWords = ['gain', 'profit', 'growth', /* add more */];
const negativeWords = ['loss', 'decline', 'fall', /* add more */];
```

### Styling Changes

All visual customization can be done in `styles.css`. The CSS uses custom properties (variables) for easy theming:

```css
:root {
    --primary-color: #1a73e8;
    --secondary-color: #34a853;
    /* Modify these values */
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "Configuration Required" message appears**
- Solution: Ensure you've added valid API keys in `main.js`

**2. "API rate limit reached" error**
- Solution: Wait for the rate limit to reset (usually 1 minute for Alpha Vantage)
- Consider upgrading to a paid API plan for higher limits

**3. No company data showing**
- Cause: API limitations or invalid symbols
- Solution: Check browser console for errors, verify symbol format

**4. News not loading**
- Check your NewsAPI key is valid
- Verify you haven't exceeded daily request limit (100 requests/day)

**5. CORS errors in browser console**
- This shouldn't occur with the configured APIs
- If it does, use a local server (see Local Setup, Option D)

### Browser Console

Open browser developer tools (F12) to view detailed error messages:
- Chrome: F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- Firefox: F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- Safari: Enable Developer menu, then Cmd+Option+I

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues
- Use GitHub Issues to report bugs
- Include browser version, OS, and steps to reproduce
- Attach screenshots if applicable

### Suggesting Enhancements
- Open an issue with the `enhancement` label
- Describe the feature and its benefits
- Explain implementation approach if possible

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Maintain the vanilla JavaScript approach (no frameworks)
- Follow existing code style and conventions
- Test thoroughly before submitting
- Update README if adding new features
- Keep commits atomic and well-described

## 📊 Future Enhancements

Potential features for future development:

- [ ] Portfolio tracking functionality
- [ ] Technical indicators (RSI, MACD, etc.)
- [ ] Price alerts and notifications
- [ ] Comparison tool for multiple stocks
- [ ] Historical performance charts
- [ ] Export data to CSV/Excel
- [ ] Watchlist functionality (localStorage)
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Integration with additional data sources

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Stock Analysis Dashboard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Alpha Vantage** for providing free stock market data API
- **NewsAPI.org** for news aggregation and delivery
- **Nifty 50** index for sector and company selection reference
- **Open source community** for inspiration and best practices

## 📞 Support & Contact

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and community interaction
- **Documentation**: This README and inline code comments

## 🔗 Useful Links

- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [NSE India](https://www.nseindia.com/) - Official stock exchange website
- [BSE India](https://www.bseindia.com/) - Bombay Stock Exchange

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

**Last Updated**: January 2025

**Built with ❤️ for the Indian stock market community**
