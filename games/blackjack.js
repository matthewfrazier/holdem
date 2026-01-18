const BlackjackAnalyzer = {
    name: 'Blackjack',

    // House edge varies significantly based on rules and player strategy
    bets: [
        {
            name: 'Basic Strategy (Good Rules)',
            houseEdge: 0.5,
            trueOdds: 'Varies',
            payout: '1:1, 3:2 on BJ',
            probability: 49.5,
            description: 'Perfect basic strategy with favorable rules (3:2 BJ, dealer stands S17, late surrender)'
        },
        {
            name: 'Basic Strategy (Average Rules)',
            houseEdge: 0.65,
            trueOdds: 'Varies',
            payout: '1:1, 3:2 on BJ',
            probability: 49.2,
            description: 'Perfect basic strategy with typical casino rules'
        },
        {
            name: 'Casual Play (Few Mistakes)',
            houseEdge: 1.5,
            trueOdds: 'Varies',
            payout: '1:1, 3:2 on BJ',
            probability: 48.5,
            description: 'Playing reasonably well but making occasional strategy errors'
        },
        {
            name: 'Poor Strategy',
            houseEdge: 3.5,
            trueOdds: 'Varies',
            payout: '1:1, 3:2 on BJ',
            probability: 46.5,
            description: 'Playing by intuition, taking insurance, ignoring basic strategy'
        },
        {
            name: 'Terrible Play + Bad Rules',
            houseEdge: 5.0,
            trueOdds: 'Varies',
            payout: '1:1, 6:5 on BJ',
            probability: 45.0,
            description: 'Poor strategy combined with 6:5 blackjack payout'
        },
        {
            name: 'Card Counting (Good Penetration)',
            houseEdge: -0.5,
            trueOdds: 'Varies',
            payout: '1:1, 3:2 on BJ',
            probability: 51.0,
            description: 'Skilled card counter with favorable conditions - player advantage!'
        }
    ],

    // Side bets have much higher house edges
    sideBets: [
        {
            name: 'Insurance',
            houseEdge: 7.4,
            description: 'Never take insurance unless counting cards - bad bet'
        },
        {
            name: 'Perfect Pairs',
            houseEdge: 6.0,
            description: 'Side bet on getting a pair - varies by casino'
        },
        {
            name: '21+3',
            houseEdge: 3.2,
            description: 'Poker-style side bet using player\'s cards and dealer upcard'
        },
        {
            name: 'Lucky Ladies',
            houseEdge: 24.9,
            description: 'Bet on getting 20 - terrible house edge'
        }
    ],

    getBestBet() {
        return this.bets.find(b => b.name === 'Basic Strategy (Good Rules)');
    },

    getWorstBet() {
        return this.bets.find(b => b.name === 'Terrible Play + Bad Rules');
    },

    getRecommendedStrategy() {
        return {
            strategy: 'Learn Basic Strategy',
            detail: 'Can reduce house edge to ~0.5%',
            tips: [
                'Learn and use perfect basic strategy - it reduces house edge to ~0.5%',
                'Always look for 3:2 blackjack payouts - avoid 6:5 tables at all costs',
                'Never take insurance (unless you\'re counting cards)',
                'Avoid all side bets - they have much higher house edges',
                'Look for favorable rules: dealer stands on soft 17, late surrender, double after split',
                'Blackjack is the only casino game where skill significantly matters',
                'Card counting can give you an edge, but casinos will ask you to leave',
                'Set a bankroll and stick to it - even with good strategy, variance is high'
            ]
        };
    },

    calculateExpectedValue(betAmount, betName) {
        const bet = this.bets.find(b => b.name === betName);
        if (!bet) return 0;
        return -betAmount * (bet.houseEdge / 100);
    },

    estimatePlaytime(bankroll, betAmount, betName) {
        const bet = this.bets.find(b => b.name === betName);
        if (!bet) return null;

        const expectedLossPerBet = betAmount * (bet.houseEdge / 100);

        // Approximate number of bets
        // With low house edge, can play much longer
        const estimatedBets = Math.floor(bankroll / (Math.abs(expectedLossPerBet) || 0.01));

        // Blackjack averages about 60-80 hands per hour depending on players
        const handsPerHour = 70;
        const hours = estimatedBets / handsPerHour;

        return {
            estimatedBets: Math.min(estimatedBets, 10000),
            estimatedHours: Math.min(hours, 333).toFixed(1),
            expectedLoss: (estimatedBets * expectedLossPerBet).toFixed(2),
            riskOfRuin: this.calculateRiskOfRuin(bankroll, betAmount, bet.houseEdge, bet.probability)
        };
    },

    calculateRiskOfRuin(bankroll, betAmount, houseEdge, winProbability) {
        const p = winProbability / 100;
        const q = 1 - p;
        const units = bankroll / betAmount;

        if (houseEdge < 0) {
            // Player has advantage - risk of ruin is low
            return (5 / Math.pow(units, 0.5)).toFixed(1);
        }

        if (p === q) return 1;

        const ratio = q / p;
        const risk = Math.pow(ratio, units);
        return (Math.min(risk * 100, 100)).toFixed(1);
    },

    getInsights() {
        const strategy = this.getRecommendedStrategy();
        return strategy.tips;
    },

    getRuleComparison() {
        return {
            favorableRules: [
                'Blackjack pays 3:2 (not 6:5)',
                'Dealer stands on soft 17',
                'Double down on any two cards',
                'Double down after split allowed',
                'Late surrender allowed',
                'Resplit aces allowed',
                ' 6 or 8 deck shoe (not continuous shuffler)'
            ],
            unfavorableRules: [
                'Blackjack pays 6:5 (adds ~1.4% to house edge)',
                'Dealer hits soft 17 (adds ~0.2%)',
                'No double after split (adds ~0.15%)',
                'No surrender (adds ~0.08%)',
                'Continuous shuffle machines',
                'Limited doubling options'
            ]
        };
    },

    getBasicStrategyHighlights() {
        return [
            'Always split Aces and 8s',
            'Never split 5s or 10s',
            'Double down on 11 (except against dealer Ace)',
            'Double down on 10 (except against dealer 10 or Ace)',
            'Stand on hard 17 or higher',
            'Hit on hard 11 or lower',
            'Stand on soft 19 or higher',
            'Never take insurance (unless counting)'
        ];
    }
};
