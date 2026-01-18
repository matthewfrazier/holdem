const RouletteAnalyzer = {
    name: 'Roulette',

    // Using American Roulette (38 pockets: 0, 00, 1-36) as default
    // European Roulette has better odds (37 pockets: 0, 1-36)
    bets: [
        {
            name: 'Straight Up (Single Number)',
            houseEdge: 5.26,
            trueOdds: '37:1',
            payout: '35:1',
            probability: 2.63,
            description: 'Bet on any single number including 0 or 00'
        },
        {
            name: 'Split (Two Numbers)',
            houseEdge: 5.26,
            trueOdds: '18:1',
            payout: '17:1',
            probability: 5.26,
            description: 'Bet on two adjacent numbers'
        },
        {
            name: 'Street (Three Numbers)',
            houseEdge: 5.26,
            trueOdds: '11.67:1',
            payout: '11:1',
            probability: 7.89,
            description: 'Bet on three numbers in a row'
        },
        {
            name: 'Corner (Four Numbers)',
            houseEdge: 5.26,
            trueOdds: '8.5:1',
            payout: '8:1',
            probability: 10.53,
            description: 'Bet on four numbers that meet at a corner'
        },
        {
            name: 'Five Number (0,00,1,2,3)',
            houseEdge: 7.89,
            trueOdds: '6.6:1',
            payout: '6:1',
            probability: 13.16,
            description: 'Worst bet in roulette - only on American tables'
        },
        {
            name: 'Line (Six Numbers)',
            houseEdge: 5.26,
            trueOdds: '5.33:1',
            payout: '5:1',
            probability: 15.79,
            description: 'Bet on two adjacent streets (six numbers)'
        },
        {
            name: 'Column',
            houseEdge: 5.26,
            trueOdds: '2.167:1',
            payout: '2:1',
            probability: 31.58,
            description: 'Bet on one of three columns of 12 numbers'
        },
        {
            name: 'Dozen',
            houseEdge: 5.26,
            trueOdds: '2.167:1',
            payout: '2:1',
            probability: 31.58,
            description: 'Bet on 1-12, 13-24, or 25-36'
        },
        {
            name: 'Red/Black',
            houseEdge: 5.26,
            trueOdds: '1.111:1',
            payout: '1:1',
            probability: 47.37,
            description: 'Bet on all red or all black numbers'
        },
        {
            name: 'Odd/Even',
            houseEdge: 5.26,
            trueOdds: '1.111:1',
            payout: '1:1',
            probability: 47.37,
            description: 'Bet on all odd or all even numbers'
        },
        {
            name: 'High/Low (1-18/19-36)',
            houseEdge: 5.26,
            trueOdds: '1.111:1',
            payout: '1:1',
            probability: 47.37,
            description: 'Bet on low (1-18) or high (19-36) numbers'
        }
    ],

    // European Roulette for comparison
    europeanBets: [
        {
            name: 'Any Bet (European)',
            houseEdge: 2.70,
            description: 'European roulette has only one zero, reducing house edge'
        },
        {
            name: 'En Prison Rule',
            houseEdge: 1.35,
            description: 'On even-money bets, if 0 hits, bet is imprisoned for next spin'
        }
    ],

    getBestBet() {
        return {
            name: 'Any European Roulette Bet',
            houseEdge: 2.70,
            description: 'All bets equal in European roulette - half the house edge of American'
        };
    },

    getWorstBet() {
        return this.bets.find(b => b.name === 'Five Number (0,00,1,2,3)');
    },

    getRecommendedStrategy() {
        return {
            strategy: 'Play European Roulette',
            detail: 'Half the house edge of American',
            tips: [
                'Choose European roulette (single zero) over American (double zero)',
                'All bets have same house edge except the "Five Number" bet',
                'Outside bets (Red/Black, Odd/Even) provide longer playtime',
                'Inside bets offer bigger payouts but same house edge',
                'Look for tables with "En Prison" or "La Partage" rules (1.35% edge)',
                'Roulette has no skill component - all spins are independent',
                'Never use betting systems (Martingale, etc.) - they don\'t change the odds'
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

        // Roulette averages about 60-80 spins per hour
        const spinsPerHour = 70;
        const hours = estimatedBets / spinsPerHour;

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

        if (p === q) return 1;

        // For roulette, calculate based on actual win/loss probability
        const avgPayout = this.getAveragePayoutMultiplier(winProbability);
        if (avgPayout <= 1) return 100; // Guaranteed ruin

        const ratio = q / (p * avgPayout);
        const risk = Math.pow(ratio, units);
        return (Math.min(risk * 100, 100)).toFixed(1);
    },

    getAveragePayoutMultiplier(winProbability) {
        // Estimate payout multiplier based on probability
        if (winProbability >= 47) return 2; // Even money
        if (winProbability >= 30) return 3; // Column/Dozen
        if (winProbability >= 15) return 6; // Line
        if (winProbability >= 10) return 9; // Corner
        if (winProbability >= 7) return 12; // Street
        if (winProbability >= 5) return 18; // Split
        return 36; // Straight up
    },

    getInsights() {
        const strategy = this.getRecommendedStrategy();
        return strategy.tips;
    }
};
