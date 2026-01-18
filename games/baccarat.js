const BaccaratAnalyzer = {
    name: 'Baccarat',

    bets: [
        {
            name: 'Banker',
            houseEdge: 1.06,
            trueOdds: '1.012:1',
            payout: '0.95:1',
            probability: 45.86,
            description: 'Best bet - 5% commission on wins, slightly better than player'
        },
        {
            name: 'Player',
            houseEdge: 1.24,
            trueOdds: '1:1',
            payout: '1:1',
            probability: 44.62,
            description: 'Second best bet - no commission, very close to banker'
        },
        {
            name: 'Tie',
            houseEdge: 14.36,
            trueOdds: '9.51:1',
            payout: '8:1',
            probability: 9.52,
            description: 'Worst bet - avoid this tempting but terrible bet'
        },
        {
            name: 'Banker Pair',
            houseEdge: 10.36,
            trueOdds: '10.1:1',
            payout: '11:1',
            probability: 7.47,
            description: 'Side bet - first two banker cards are a pair'
        },
        {
            name: 'Player Pair',
            houseEdge: 10.36,
            trueOdds: '10.1:1',
            payout: '11:1',
            probability: 7.47,
            description: 'Side bet - first two player cards are a pair'
        },
        {
            name: 'Perfect Pair',
            houseEdge: 13.03,
            trueOdds: '24:1',
            payout: '25:1',
            probability: 3.85,
            description: 'Side bet - suited pair (varies by casino)'
        },
        {
            name: 'Either Pair',
            houseEdge: 13.71,
            trueOdds: '4.76:1',
            payout: '5:1',
            probability: 14.22,
            description: 'Side bet - either banker or player gets a pair'
        }
    ],

    getBestBet() {
        return this.bets.find(b => b.name === 'Banker');
    },

    getWorstBet() {
        return this.bets.find(b => b.name === 'Tie');
    },

    getRecommendedStrategy() {
        return {
            strategy: 'Banker Bet Only',
            detail: 'Lowest house edge at 1.06%',
            tips: [
                'Always bet on Banker - it has the lowest house edge (1.06%)',
                'Player bet is acceptable with only 1.24% house edge',
                'Never bet on Tie - 14.36% house edge makes it one of the worst casino bets',
                'Ignore all side bets (pairs, etc.) - they have high house edges',
                'Baccarat has no skill element - card counting doesn\'t work effectively',
                'Don\'t follow "patterns" on scoreboards - each hand is independent',
                'The 5% commission on Banker bets is worth paying for the better odds',
                'Some casinos offer "no commission" baccarat with modified rules - check carefully'
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
        const estimatedBets = Math.floor(bankroll / (expectedLossPerBet || 0.01));

        // Baccarat is fast - about 50-60 hands per hour
        const handsPerHour = 55;
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

        // For Banker bet, account for commission
        let payoutMultiplier = 2;
        if (winProbability === 45.86) { // Banker bet
            payoutMultiplier = 1.95; // 1:1 minus 5% commission
        }

        if (p === 0.5) return 1;

        const a = (q / p) / (payoutMultiplier - 1);
        const risk = Math.pow(a, units);
        return (Math.min(risk * 100, 100)).toFixed(1);
    },

    getInsights() {
        const strategy = this.getRecommendedStrategy();
        return strategy.tips;
    },

    getComparison() {
        return {
            title: 'Why Baccarat is Popular',
            points: [
                'One of the lowest house edges in the casino (Banker at 1.06%)',
                'Simple rules - no decisions to make during play',
                'Fast-paced game with quick resolution',
                'Popular with high rollers due to low edge',
                'Tie bet ruins many players - avoid it at all costs'
            ]
        };
    }
};
