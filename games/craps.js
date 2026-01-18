const CrapsAnalyzer = {
    name: 'Craps',

    bets: [
        {
            name: 'Pass Line',
            houseEdge: 1.41,
            trueOdds: '251:244',
            payout: '1:1',
            probability: 49.29,
            description: 'Win on 7/11 on come-out, lose on 2/3/12, then point must hit before 7'
        },
        {
            name: 'Pass Line + Odds (3-4-5x)',
            houseEdge: 0.37,
            trueOdds: 'Varies',
            payout: 'True odds',
            probability: 49.29,
            description: 'Best overall bet - reduces house edge significantly'
        },
        {
            name: "Don't Pass",
            houseEdge: 1.36,
            trueOdds: '976:949',
            payout: '1:1',
            probability: 47.93,
            description: 'Betting against the shooter - slightly better than Pass'
        },
        {
            name: "Don't Pass + Odds (3-4-5x)",
            houseEdge: 0.27,
            trueOdds: 'Varies',
            payout: 'True odds',
            probability: 47.93,
            description: 'Absolute best bet in craps'
        },
        {
            name: 'Come',
            houseEdge: 1.41,
            trueOdds: '251:244',
            payout: '1:1',
            probability: 49.29,
            description: 'Same as Pass Line but made after point is established'
        },
        {
            name: "Don't Come",
            houseEdge: 1.36,
            trueOdds: '976:949',
            payout: '1:1',
            probability: 47.93,
            description: 'Same as Don\'t Pass but made after point is established'
        },
        {
            name: 'Field',
            houseEdge: 5.56,
            trueOdds: '5:4',
            payout: '1:1, 2:1 on 2/12',
            probability: 44.44,
            description: 'One-roll bet on 2,3,4,9,10,11,12'
        },
        {
            name: 'Place 6',
            houseEdge: 1.52,
            trueOdds: '6:5',
            payout: '7:6',
            probability: 45.45,
            description: 'Bet that 6 will roll before 7'
        },
        {
            name: 'Place 8',
            houseEdge: 1.52,
            trueOdds: '6:5',
            payout: '7:6',
            probability: 45.45,
            description: 'Bet that 8 will roll before 7'
        },
        {
            name: 'Place 5',
            houseEdge: 4.00,
            trueOdds: '3:2',
            payout: '7:5',
            probability: 40.00,
            description: 'Bet that 5 will roll before 7'
        },
        {
            name: 'Place 9',
            houseEdge: 4.00,
            trueOdds: '3:2',
            payout: '7:5',
            probability: 40.00,
            description: 'Bet that 9 will roll before 7'
        },
        {
            name: 'Place 4',
            houseEdge: 6.67,
            trueOdds: '2:1',
            payout: '9:5',
            probability: 33.33,
            description: 'Bet that 4 will roll before 7'
        },
        {
            name: 'Place 10',
            houseEdge: 6.67,
            trueOdds: '2:1',
            payout: '9:5',
            probability: 33.33,
            description: 'Bet that 10 will roll before 7'
        },
        {
            name: 'Big 6',
            houseEdge: 9.09,
            trueOdds: '6:5',
            payout: '1:1',
            probability: 45.45,
            description: 'Same as Place 6 but worse payout - avoid this bet'
        },
        {
            name: 'Big 8',
            houseEdge: 9.09,
            trueOdds: '6:5',
            payout: '1:1',
            probability: 45.45,
            description: 'Same as Place 8 but worse payout - avoid this bet'
        },
        {
            name: 'Any 7',
            houseEdge: 16.67,
            trueOdds: '5:1',
            payout: '4:1',
            probability: 16.67,
            description: 'One-roll bet - worst bet on the table'
        },
        {
            name: 'Any Craps',
            houseEdge: 11.11,
            trueOdds: '8:1',
            payout: '7:1',
            probability: 11.11,
            description: 'One-roll bet on 2,3,12'
        },
        {
            name: 'Hard 4',
            houseEdge: 11.11,
            trueOdds: '8:1',
            payout: '7:1',
            probability: 11.11,
            description: 'Win on 2-2, lose on easy 4 or 7'
        },
        {
            name: 'Hard 10',
            houseEdge: 11.11,
            trueOdds: '8:1',
            payout: '7:1',
            probability: 11.11,
            description: 'Win on 5-5, lose on easy 10 or 7'
        },
        {
            name: 'Hard 6',
            houseEdge: 9.09,
            trueOdds: '10:1',
            payout: '9:1',
            probability: 9.09,
            description: 'Win on 3-3, lose on easy 6 or 7'
        },
        {
            name: 'Hard 8',
            houseEdge: 9.09,
            trueOdds: '10:1',
            payout: '9:1',
            probability: 9.09,
            description: 'Win on 4-4, lose on easy 8 or 7'
        }
    ],

    getBestBet() {
        return this.bets.reduce((best, bet) =>
            bet.houseEdge < best.houseEdge ? bet : best
        );
    },

    getWorstBet() {
        return this.bets.reduce((worst, bet) =>
            bet.houseEdge > worst.houseEdge ? bet : worst
        );
    },

    getRecommendedStrategy() {
        return {
            strategy: 'Pass Line + Max Odds',
            detail: 'Lowest house edge, extends playtime',
            tips: [
                'Always take maximum odds on Pass Line bets',
                'Stick to Pass/Don\'t Pass with odds - avoid proposition bets',
                'Place 6 and 8 are acceptable if you want more action',
                'Never bet Big 6/8, Any 7, or hardways',
                'Set a loss limit and walk away when reached'
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
        const variance = betAmount * Math.sqrt(bet.probability * (100 - bet.probability) / 100);

        // Approximate number of bets using gambler's ruin formula
        const estimatedBets = Math.floor(bankroll / (expectedLossPerBet || 0.01));

        // Craps averages about 100 rolls per hour, with varying bet resolution
        const betsPerHour = 30; // Conservative estimate
        const hours = estimatedBets / betsPerHour;

        return {
            estimatedBets: Math.min(estimatedBets, 10000),
            estimatedHours: Math.min(hours, 333).toFixed(1),
            expectedLoss: (estimatedBets * expectedLossPerBet).toFixed(2),
            riskOfRuin: this.calculateRiskOfRuin(bankroll, betAmount, bet.houseEdge)
        };
    },

    calculateRiskOfRuin(bankroll, betAmount, houseEdge) {
        // Simplified risk of ruin calculation
        const p = 0.5 - (houseEdge / 200); // Probability of winning single bet
        const q = 1 - p; // Probability of losing
        const units = bankroll / betAmount;

        if (p === q) return 1;

        const ratio = q / p;
        const risk = Math.pow(ratio, units);
        return (Math.min(risk * 100, 100)).toFixed(1);
    },

    getInsights() {
        const strategy = this.getRecommendedStrategy();
        return strategy.tips;
    }
};
