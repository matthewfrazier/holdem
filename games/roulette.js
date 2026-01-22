// Roulette Game Analyzer with variations
const RouletteAnalyzer = {
    name: 'Roulette',
    variations: ['american', 'european'],
    currentVariation: 'american',

    variationData: {
        american: {
            name: 'American Roulette',
            description: '38 pockets (0, 00, 1-36) - Higher house edge',
            pockets: 38,
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
            ]
        },
        european: {
            name: 'European Roulette',
            description: '37 pockets (0, 1-36) - Half the house edge',
            pockets: 37,
            bets: [
                {
                    name: 'Straight Up (Single Number)',
                    houseEdge: 2.70,
                    trueOdds: '36:1',
                    payout: '35:1',
                    probability: 2.70,
                    description: 'Bet on any single number including 0'
                },
                {
                    name: 'Split (Two Numbers)',
                    houseEdge: 2.70,
                    trueOdds: '17.5:1',
                    payout: '17:1',
                    probability: 5.41,
                    description: 'Bet on two adjacent numbers'
                },
                {
                    name: 'Street (Three Numbers)',
                    houseEdge: 2.70,
                    trueOdds: '11.33:1',
                    payout: '11:1',
                    probability: 8.11,
                    description: 'Bet on three numbers in a row'
                },
                {
                    name: 'Corner (Four Numbers)',
                    houseEdge: 2.70,
                    trueOdds: '8.25:1',
                    payout: '8:1',
                    probability: 10.81,
                    description: 'Bet on four numbers that meet at a corner'
                },
                {
                    name: 'Line (Six Numbers)',
                    houseEdge: 2.70,
                    trueOdds: '5.17:1',
                    payout: '5:1',
                    probability: 16.22,
                    description: 'Bet on two adjacent streets (six numbers)'
                },
                {
                    name: 'Column',
                    houseEdge: 2.70,
                    trueOdds: '2.083:1',
                    payout: '2:1',
                    probability: 32.43,
                    description: 'Bet on one of three columns of 12 numbers'
                },
                {
                    name: 'Dozen',
                    houseEdge: 2.70,
                    trueOdds: '2.083:1',
                    payout: '2:1',
                    probability: 32.43,
                    description: 'Bet on 1-12, 13-24, or 25-36'
                },
                {
                    name: 'Red/Black',
                    houseEdge: 2.70,
                    trueOdds: '1.056:1',
                    payout: '1:1',
                    probability: 48.65,
                    description: 'Bet on all red or all black numbers'
                },
                {
                    name: 'Odd/Even',
                    houseEdge: 2.70,
                    trueOdds: '1.056:1',
                    payout: '1:1',
                    probability: 48.65,
                    description: 'Bet on all odd or all even numbers'
                },
                {
                    name: 'High/Low (1-18/19-36)',
                    houseEdge: 2.70,
                    trueOdds: '1.056:1',
                    payout: '1:1',
                    probability: 48.65,
                    description: 'Bet on low (1-18) or high (19-36) numbers'
                },
                {
                    name: 'Red/Black (La Partage)',
                    houseEdge: 1.35,
                    trueOdds: '1.056:1',
                    payout: '1:1 (half back on 0)',
                    probability: 48.65,
                    description: 'Even-money bet with half returned if 0 hits'
                },
                {
                    name: 'Red/Black (En Prison)',
                    houseEdge: 1.35,
                    trueOdds: '1.056:1',
                    payout: '1:1 (imprisoned on 0)',
                    probability: 48.65,
                    description: 'Even-money bet held for next spin if 0 hits'
                }
            ]
        }
    },

    get bets() {
        return this.variationData[this.currentVariation].bets;
    },

    setVariation(variation) {
        if (this.variations.includes(variation)) {
            this.currentVariation = variation;
        }
    },

    getVariationInfo() {
        return {
            current: this.currentVariation,
            available: this.variations.map(v => ({
                id: v,
                name: this.variationData[v].name,
                description: this.variationData[v].description
            }))
        };
    },

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
        if (this.currentVariation === 'european') {
            return {
                strategy: 'Even Money with La Partage',
                detail: '1.35% house edge - best roulette bet',
                tips: [
                    'Look for tables with La Partage or En Prison rules (1.35% edge)',
                    'European single-zero has half the house edge of American (2.70% vs 5.26%)',
                    'All bets have the same house edge except with special rules',
                    'Outside bets (Red/Black, Odd/Even) give the most playtime',
                    'Inside bets have bigger payouts but same expected value',
                    'No betting system can overcome the house edge'
                ]
            };
        }
        return {
            strategy: 'Play European Instead',
            detail: 'American roulette has 2x the house edge',
            tips: [
                'American roulette has 5.26% house edge vs 2.70% for European',
                'NEVER bet the Five Number (0,00,1,2,3) - worst bet at 7.89%',
                'All other bets have identical 5.26% house edge',
                'If you must play American, stick to outside bets for longer play',
                'The double-zero pocket is purely extra profit for the casino',
                'Betting systems (Martingale, etc.) do not change the odds'
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
