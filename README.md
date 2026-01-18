# Casino Game Analyzer

A comprehensive, educational web application that visualizes and analyzes the house advantage across popular casino games. Make informed decisions by understanding the mathematics behind games of chance.

## Features

- **Visual Infographics**: Single-glance visualization of house edge, probability distributions, and expected values
- **Multiple Games Supported**:
  - Craps
  - Roulette (American & European)
  - Baccarat
  - Blackjack
- **Interactive Analysis**: Compare different bet types and strategies
- **Playtime Calculator**: Estimate how long your bankroll will last based on bet size and game selection
- **Educational Insights**: Learn optimal strategies to extend playtime and minimize losses

## How to Use

### Running the Application

1. Simply open `index.html` in any modern web browser
2. No installation or server required - it's a pure client-side application

### Navigating the Interface

1. **Select a Game**: Click on one of the four game buttons (Craps, Roulette, Baccarat, Blackjack)
2. **Review Statistics**: The top section shows:
   - Best bet for the selected game
   - Worst bet to avoid
   - Recommended strategy
3. **Analyze Visualizations**:
   - **House Edge Chart**: Compare the house advantage across different bet types
   - **Expected Value Chart**: See your expected loss per $100 bet
   - **Probability Distribution**: Understand your chances of winning
   - **Detailed Bet Table**: Complete breakdown of all available bets
4. **Use the Playtime Calculator**:
   - Enter your starting bankroll
   - Set your bet amount
   - Select the bet type
   - See estimated playtime and expected loss

## Understanding the Data

### House Edge

The house edge is the casino's mathematical advantage, expressed as a percentage. For example:
- **1% house edge** = You'll lose $1 for every $100 wagered (on average, over time)
- **Lower is better** for the player

### Expected Value (EV)

Expected Value shows your average loss (or gain) per bet. Negative EV means you'll lose money over time.

### Risk of Ruin

The probability that you'll lose your entire bankroll before achieving a specific goal.

## Key Insights by Game

### Craps
- **Best Bet**: Don't Pass + Odds (0.27% house edge)
- **Avoid**: Any 7 (16.67% house edge)
- **Strategy**: Stick to Pass/Don't Pass with maximum odds

### Roulette
- **Best Bet**: Any bet on European Roulette (2.70% house edge)
- **Avoid**: Five Number bet on American Roulette (7.89% house edge)
- **Strategy**: Play European roulette when possible; all bets have the same edge

### Baccarat
- **Best Bet**: Banker (1.06% house edge)
- **Avoid**: Tie (14.36% house edge)
- **Strategy**: Always bet on Banker, never on Tie

### Blackjack
- **Best Bet**: Basic Strategy with good rules (0.5% house edge)
- **Avoid**: Playing without strategy or 6:5 tables (5%+ house edge)
- **Strategy**: Learn and use perfect basic strategy; look for 3:2 blackjack payouts

## Mathematical Notes

All calculations are based on:
- Theoretical probability for each game
- Standard casino rules (variations noted)
- Perfect play for strategy-dependent games (like blackjack)
- Long-term expected outcomes (short-term variance will differ)

## Educational Purpose

This tool is designed for educational purposes to help users understand:
- The mathematical odds of casino games
- How house advantage works
- Which bets provide the best value
- Realistic expectations for bankroll longevity

## Responsible Gambling

Remember:
- The house always has an edge (except with perfect blackjack play)
- No betting system can overcome the house edge
- Set strict limits and stick to them
- Gambling should be entertainment, not a way to make money
- If gambling becomes a problem, seek help at [National Council on Problem Gambling](https://www.ncpgambling.org/)

## Technical Stack

- **HTML5/CSS3**: Modern, responsive design
- **JavaScript (ES6+)**: Pure vanilla JS, no framework dependencies
- **Chart.js**: Beautiful, interactive visualizations
- **No server required**: Runs entirely in the browser

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## File Structure

```
.
├── index.html          # Main application page
├── styles.css          # All styling and layout
├── app.js             # Main application logic and visualizations
├── games/
│   ├── craps.js       # Craps game analysis
│   ├── roulette.js    # Roulette game analysis
│   ├── baccarat.js    # Baccarat game analysis
│   └── blackjack.js   # Blackjack game analysis
└── README.md          # This file
```

## Contributing

This is an educational project. If you find any mathematical errors or want to suggest improvements:
1. Verify calculations with reputable gambling mathematics sources
2. Consider the pedagogical value of changes
3. Maintain focus on harm reduction and informed decision-making

## License

This project is released for educational purposes. Use freely for learning and teaching about probability and expected value in games of chance.

## Disclaimer

This application is for educational and informational purposes only. It does not promote gambling and does not guarantee any particular outcome. All calculations are theoretical and based on perfect conditions. Actual casino games may have rule variations that affect the house edge. Always gamble responsibly and within your means.

---

**Remember**: The only way to guarantee not losing money at a casino is not to gamble. If you choose to gamble, do so for entertainment only, with money you can afford to lose.
