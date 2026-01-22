// Craps Game Analyzer with variations and Monte Carlo simulation
const CrapsAnalyzer = {
    name: 'Craps',
    variations: ['standard', 'crapless'],
    currentVariation: 'standard',

    // Place bet payouts and minimum bet requirements
    placeBets: {
        6: { payout: 7/6, trueOdds: 6/5, houseEdge: 1.52, minUnit: 6 },
        8: { payout: 7/6, trueOdds: 6/5, houseEdge: 1.52, minUnit: 6 },
        5: { payout: 7/5, trueOdds: 3/2, houseEdge: 4.00, minUnit: 5 },
        9: { payout: 7/5, trueOdds: 3/2, houseEdge: 4.00, minUnit: 5 },
        4: { payout: 9/5, trueOdds: 2/1, houseEdge: 6.67, minUnit: 5 },
        10: { payout: 9/5, trueOdds: 2/1, houseEdge: 6.67, minUnit: 5 }
    },

    // Odds payouts by point
    oddsPayouts: {
        4: 2/1, 10: 2/1,
        5: 3/2, 9: 3/2,
        6: 6/5, 8: 6/5
    },

    variationData: {
        standard: {
            name: 'Standard Craps',
            description: 'Traditional craps with pass/don\'t pass bets',
            bets: [
                { name: 'Pass Line', houseEdge: 1.41, trueOdds: '251:244', payout: '1:1', probability: 49.29, description: 'Win on 7/11, lose on 2/3/12', category: 'line' },
                { name: "Don't Pass", houseEdge: 1.36, trueOdds: '976:949', payout: '1:1', probability: 47.93, description: 'Opposite of Pass Line', category: 'line' },
                { name: 'Come', houseEdge: 1.41, trueOdds: '251:244', payout: '1:1', probability: 49.29, description: 'Like Pass after point', category: 'line' },
                { name: "Don't Come", houseEdge: 1.36, trueOdds: '976:949', payout: '1:1', probability: 47.93, description: 'Like Don\'t Pass after point', category: 'line' },
                { name: 'Place 6', houseEdge: 1.52, trueOdds: '6:5', payout: '7:6', probability: 45.45, description: 'Bet 6 hits before 7', category: 'place' },
                { name: 'Place 8', houseEdge: 1.52, trueOdds: '6:5', payout: '7:6', probability: 45.45, description: 'Bet 8 hits before 7', category: 'place' },
                { name: 'Place 5', houseEdge: 4.00, trueOdds: '3:2', payout: '7:5', probability: 40.00, description: 'Bet 5 hits before 7', category: 'place' },
                { name: 'Place 9', houseEdge: 4.00, trueOdds: '3:2', payout: '7:5', probability: 40.00, description: 'Bet 9 hits before 7', category: 'place' },
                { name: 'Place 4', houseEdge: 6.67, trueOdds: '2:1', payout: '9:5', probability: 33.33, description: 'Bet 4 hits before 7', category: 'place' },
                { name: 'Place 10', houseEdge: 6.67, trueOdds: '2:1', payout: '9:5', probability: 33.33, description: 'Bet 10 hits before 7', category: 'place' },
                { name: 'Field', houseEdge: 5.56, trueOdds: '5:4', payout: '1:1, 2:1 on 2/12', probability: 44.44, description: 'One-roll on 2,3,4,9,10,11,12', category: 'proposition' },
                { name: 'Any 7', houseEdge: 16.67, trueOdds: '5:1', payout: '4:1', probability: 16.67, description: 'One-roll bet - avoid', category: 'proposition' },
                { name: 'Any Craps', houseEdge: 11.11, trueOdds: '8:1', payout: '7:1', probability: 11.11, description: 'One-roll on 2,3,12', category: 'proposition' },
                { name: 'Hard 6/8', houseEdge: 9.09, trueOdds: '10:1', payout: '9:1', probability: 9.09, description: 'Hardway bet', category: 'hardway' },
                { name: 'Hard 4/10', houseEdge: 11.11, trueOdds: '8:1', payout: '7:1', probability: 11.11, description: 'Hardway bet', category: 'hardway' },
                { name: 'Big 6/8', houseEdge: 9.09, trueOdds: '6:5', payout: '1:1', probability: 45.45, description: 'Never bet - use Place instead', category: 'proposition' }
            ]
        },
        crapless: {
            name: 'Crapless Craps',
            description: 'No craps numbers - 2,3,11,12 become points',
            bets: [
                { name: 'Pass Line', houseEdge: 5.38, trueOdds: 'Varies', payout: '1:1', probability: 47.85, description: '2,3,11,12 become points', category: 'line' },
                { name: 'Place 6', houseEdge: 1.52, trueOdds: '6:5', payout: '7:6', probability: 45.45, description: 'Best bet in crapless', category: 'place' },
                { name: 'Place 8', houseEdge: 1.52, trueOdds: '6:5', payout: '7:6', probability: 45.45, description: 'Best bet in crapless', category: 'place' },
                { name: 'Place 5', houseEdge: 4.00, trueOdds: '3:2', payout: '7:5', probability: 40.00, description: 'Bet 5 hits before 7', category: 'place' },
                { name: 'Place 9', houseEdge: 4.00, trueOdds: '3:2', payout: '7:5', probability: 40.00, description: 'Bet 9 hits before 7', category: 'place' },
                { name: 'Place 4', houseEdge: 6.67, trueOdds: '2:1', payout: '9:5', probability: 33.33, description: 'Bet 4 hits before 7', category: 'place' },
                { name: 'Place 10', houseEdge: 6.67, trueOdds: '2:1', payout: '9:5', probability: 33.33, description: 'Bet 10 hits before 7', category: 'place' },
                { name: 'Place 2/12', houseEdge: 7.14, trueOdds: '6:1', payout: '11:2', probability: 14.29, description: 'Crapless only', category: 'place' },
                { name: 'Place 3/11', houseEdge: 6.25, trueOdds: '3:1', payout: '11:4', probability: 25.00, description: 'Crapless only', category: 'place' }
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
        return this.bets.reduce((best, bet) => bet.houseEdge < best.houseEdge ? bet : best);
    },

    getWorstBet() {
        return this.bets.reduce((worst, bet) => bet.houseEdge > worst.houseEdge ? bet : worst);
    },

    // Calculate the proper place bet amount for a given table minimum
    getPlaceBetAmount(point, tableMin) {
        const info = this.placeBets[point];
        if (!info) return tableMin;
        // Round up to nearest unit
        return Math.ceil(tableMin / info.minUnit) * info.minUnit;
    },

    // Get odds multiplier for a specific point (handles 3-4-5x)
    getOddsMultiplier(point, maxOdds) {
        if (maxOdds === '3-4-5') {
            if (point === 4 || point === 10) return 3;
            if (point === 5 || point === 9) return 4;
            if (point === 6 || point === 8) return 5;
            return 3;
        }
        return parseFloat(maxOdds) || 0;
    },

    // Calculate combined house edge with odds
    getCombinedHouseEdge(passLineBet, oddsMultiplier) {
        // Edge = (passLineBet * 1.41%) / (passLineBet + avgOddsBet)
        // For 3-4-5x, average odds is approximately 3.8x
        const avgMult = oddsMultiplier === '3-4-5' ? 3.8 : parseFloat(oddsMultiplier) || 0;
        if (avgMult === 0) return 1.41;
        return (1.41 / (1 + avgMult));
    },

    // Generate exact betting recommendations
    generateBettingStrategy(bankroll, tableMin, tableMax, maxOdds) {
        const strategy = [];
        const isUniformOdds = maxOdds !== '3-4-5' && maxOdds !== '0';
        const oddsValue = maxOdds === '3-4-5' ? 3.8 : parseFloat(maxOdds) || 0;

        // Pass Line recommendation
        const passLine = tableMin;
        const passOdds345 = maxOdds === '3-4-5'
            ? `$${tableMin * 3} (4/10), $${tableMin * 4} (5/9), $${tableMin * 5} (6/8)`
            : `$${tableMin * oddsValue}`;

        const combinedEdge = this.getCombinedHouseEdge(passLine, maxOdds);

        strategy.push({
            name: 'Pass Line + Max Odds',
            amount: `$${passLine}`,
            detail: oddsValue > 0
                ? `Odds: ${passOdds345} (${combinedEdge.toFixed(2)}% combined edge)`
                : 'No odds available',
            type: 'line',
            totalExposure: passLine + (passLine * oddsValue)
        });

        // Place 6 and 8 (best place bets)
        const place6 = this.getPlaceBetAmount(6, tableMin);
        const place8 = this.getPlaceBetAmount(8, tableMin);
        strategy.push({
            name: 'Place 6 & 8',
            amount: `$${place6} + $${place8}`,
            detail: `Each pays $${Math.floor(place6 * 7/6)} on win (1.52% edge)`,
            type: 'place',
            totalExposure: place6 + place8
        });

        // Place 5 and 9 (if bankroll allows)
        if (bankroll >= tableMin * 10) {
            const place5 = this.getPlaceBetAmount(5, tableMin);
            const place9 = this.getPlaceBetAmount(9, tableMin);
            strategy.push({
                name: 'Place 5 & 9',
                amount: `$${place5} + $${place9}`,
                detail: `Each pays $${Math.floor(place5 * 7/5)} on win (4.0% edge)`,
                type: 'place',
                totalExposure: place5 + place9
            });
        }

        // If 10x uniform odds, note the specific advantage
        if (isUniformOdds && oddsValue >= 10) {
            strategy.push({
                name: `${maxOdds}x Odds Promo`,
                amount: `$${passLine} + $${passLine * oddsValue}`,
                detail: `Only ${combinedEdge.toFixed(3)}% edge - exceptional value`,
                type: 'line',
                totalExposure: passLine * (1 + oddsValue)
            });
        }

        return strategy;
    },

    // Monte Carlo simulation for realistic session outcomes
    runSimulation(bankroll, tableMin, maxOdds, numSessions = 1000, targetHours = 4) {
        const rollsPerHour = 100; // Average craps rolls per hour
        const targetRolls = targetHours * rollsPerHour;
        const oddsMultiplier = maxOdds === '3-4-5' ? 3.8 : parseFloat(maxOdds) || 0;
        const passLineBet = tableMin;
        const oddsBet = passLineBet * oddsMultiplier;
        const totalBetPerRound = passLineBet + oddsBet;

        let bustCount = 0;
        let totalEndBankroll = 0;
        let totalRolls = 0;
        let winCount = 0;
        let outcomes = [];

        for (let session = 0; session < numSessions; session++) {
            let currentBankroll = bankroll;
            let rolls = 0;
            let point = null;

            while (currentBankroll >= passLineBet && rolls < targetRolls) {
                rolls++;

                // Roll dice
                const die1 = Math.floor(Math.random() * 6) + 1;
                const die2 = Math.floor(Math.random() * 6) + 1;
                const roll = die1 + die2;

                if (point === null) {
                    // Come out roll
                    currentBankroll -= passLineBet;
                    if (roll === 7 || roll === 11) {
                        currentBankroll += passLineBet * 2; // Win
                    } else if (roll === 2 || roll === 3 || roll === 12) {
                        // Lose - already deducted
                    } else {
                        point = roll;
                        // Take odds if we can afford it
                        if (currentBankroll >= oddsBet) {
                            currentBankroll -= oddsBet;
                        }
                    }
                } else {
                    // Point established
                    if (roll === point) {
                        // Win!
                        currentBankroll += passLineBet * 2;
                        currentBankroll += oddsBet + (oddsBet * this.oddsPayouts[point]);
                        point = null;
                    } else if (roll === 7) {
                        // Seven out - lose pass and odds
                        point = null;
                    }
                }
            }

            if (currentBankroll < passLineBet) {
                bustCount++;
            }
            if (currentBankroll > bankroll) {
                winCount++;
            }
            totalEndBankroll += currentBankroll;
            totalRolls += rolls;
            outcomes.push(currentBankroll);
        }

        // Calculate percentiles
        outcomes.sort((a, b) => a - b);
        const median = outcomes[Math.floor(numSessions / 2)];
        const worst10 = outcomes[Math.floor(numSessions * 0.1)];
        const best10 = outcomes[Math.floor(numSessions * 0.9)];

        return {
            bustRate: ((bustCount / numSessions) * 100).toFixed(1),
            winRate: ((winCount / numSessions) * 100).toFixed(1),
            avgEndBankroll: Math.round(totalEndBankroll / numSessions),
            avgRolls: Math.round(totalRolls / numSessions),
            avgHours: (totalRolls / numSessions / rollsPerHour).toFixed(1),
            medianOutcome: Math.round(median),
            worst10Pct: Math.round(worst10),
            best10Pct: Math.round(best10),
            expectedLoss: Math.round(bankroll - (totalEndBankroll / numSessions))
        };
    },

    getRecommendedStrategy() {
        if (this.currentVariation === 'crapless') {
            return {
                strategy: 'Place 6 and 8',
                detail: 'Avoid pass line in crapless (5.38% edge)',
                tips: [
                    'Crapless pass line has 5.38% edge vs 1.41% standard',
                    'Place 6 and 8 are the best bets here (1.52% edge)',
                    'No Don\'t Pass option is a major disadvantage',
                    'Only play if standard craps unavailable'
                ]
            };
        }
        return {
            strategy: 'Pass + Max Odds',
            detail: 'Lowest combined house edge',
            tips: [
                'Always take maximum odds on Pass/Come bets',
                'Place 6 and 8 only (1.52%) - skip 4,5,9,10',
                'Never bet proposition bets, Big 6/8, or hardways',
                'Don\'t Pass has slightly better odds (1.36%)',
                '10x odds tables reduce edge to ~0.18%'
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
        const estimatedBets = Math.floor(bankroll / (expectedLossPerBet || 0.01));
        const betsPerHour = 30;
        const hours = estimatedBets / betsPerHour;

        return {
            estimatedBets: Math.min(estimatedBets, 10000),
            estimatedHours: Math.min(hours, 333).toFixed(1),
            expectedLoss: (estimatedBets * expectedLossPerBet).toFixed(2)
        };
    },

    getInsights() {
        return this.getRecommendedStrategy().tips;
    }
};
