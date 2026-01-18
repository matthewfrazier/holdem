// Main application logic
class CasinoAnalyzerApp {
    constructor() {
        this.currentGame = CrapsAnalyzer;
        this.charts = {
            houseEdge: null,
            expectedValue: null,
            probability: null
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGame(CrapsAnalyzer);
    }

    setupEventListeners() {
        // Game selector buttons
        const gameButtons = document.querySelectorAll('.game-btn');
        gameButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                gameButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const game = e.target.dataset.game;
                this.loadGameByName(game);
            });
        });

        // Calculator inputs
        const bankrollInput = document.getElementById('bankroll');
        const betAmountInput = document.getElementById('bet-amount');
        const betTypeSelect = document.getElementById('bet-type');

        [bankrollInput, betAmountInput, betTypeSelect].forEach(input => {
            input.addEventListener('change', () => this.updatePlaytimeCalculator());
        });
    }

    loadGameByName(gameName) {
        const gameMap = {
            'craps': CrapsAnalyzer,
            'roulette': RouletteAnalyzer,
            'baccarat': BaccaratAnalyzer,
            'blackjack': BlackjackAnalyzer
        };

        const game = gameMap[gameName];
        if (game) {
            this.loadGame(game);
        }
    }

    loadGame(game) {
        this.currentGame = game;
        this.updateGameInfo();
        this.updateCharts();
        this.updateBetTable();
        this.updateInsights();
        this.populateBetTypeSelect();
        this.updatePlaytimeCalculator();
    }

    updateGameInfo() {
        const game = this.currentGame;
        document.getElementById('game-title').textContent = `${game.name} Analysis`;

        const best = game.getBestBet();
        const worst = game.getWorstBet();
        const strategy = game.getRecommendedStrategy();

        document.getElementById('best-bet').textContent = best.name;
        document.getElementById('best-edge').textContent = `${best.houseEdge}% house edge`;

        document.getElementById('worst-bet').textContent = worst.name;
        document.getElementById('worst-edge').textContent = `${worst.houseEdge}% house edge`;

        document.getElementById('strategy').textContent = strategy.strategy;
        document.getElementById('strategy-detail').textContent = strategy.detail;
    }

    updateCharts() {
        this.createHouseEdgeChart();
        this.createExpectedValueChart();
        this.createProbabilityChart();
    }

    createHouseEdgeChart() {
        const ctx = document.getElementById('houseEdgeChart');
        if (!ctx) return;

        const bets = this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge);

        // Limit to top 10 for readability
        const displayBets = bets.slice(0, 10);

        const data = {
            labels: displayBets.map(b => b.name),
            datasets: [{
                label: 'House Edge %',
                data: displayBets.map(b => b.houseEdge),
                backgroundColor: displayBets.map(b => this.getColorForEdge(b.houseEdge)),
                borderColor: displayBets.map(b => this.getColorForEdge(b.houseEdge, 0.8)),
                borderWidth: 2
            }]
        };

        if (this.charts.houseEdge) {
            this.charts.houseEdge.destroy();
        }

        this.charts.houseEdge = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `House Edge: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'House Edge %'
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    createExpectedValueChart() {
        const ctx = document.getElementById('expectedValueChart');
        if (!ctx) return;

        const betAmount = 100;
        const bets = this.currentGame.bets.slice().sort((a, b) =>
            this.currentGame.calculateExpectedValue(betAmount, b.name) -
            this.currentGame.calculateExpectedValue(betAmount, a.name)
        );

        const displayBets = bets.slice(0, 10);

        const data = {
            labels: displayBets.map(b => b.name),
            datasets: [{
                label: 'Expected Value per $100',
                data: displayBets.map(b => this.currentGame.calculateExpectedValue(betAmount, b.name)),
                backgroundColor: displayBets.map(b => {
                    const ev = this.currentGame.calculateExpectedValue(betAmount, b.name);
                    return ev >= 0 ? 'rgba(39, 174, 96, 0.6)' : 'rgba(231, 76, 60, 0.6)';
                }),
                borderColor: displayBets.map(b => {
                    const ev = this.currentGame.calculateExpectedValue(betAmount, b.name);
                    return ev >= 0 ? 'rgba(39, 174, 96, 1)' : 'rgba(231, 76, 60, 1)';
                }),
                borderWidth: 2
            }]
        };

        if (this.charts.expectedValue) {
            this.charts.expectedValue.destroy();
        }

        this.charts.expectedValue = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Expected Loss: $${Math.abs(context.parsed.y).toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Expected Value ($)'
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    createProbabilityChart() {
        const ctx = document.getElementById('probabilityChart');
        if (!ctx) return;

        const bets = this.currentGame.bets.slice().sort((a, b) => b.probability - a.probability);
        const displayBets = bets.slice(0, 8);

        const data = {
            labels: displayBets.map(b => b.name),
            datasets: [{
                label: 'Win Probability %',
                data: displayBets.map(b => b.probability),
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            }]
        };

        if (this.charts.probability) {
            this.charts.probability.destroy();
        }

        this.charts.probability = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Win Probability: ${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Win Probability %'
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    updateBetTable() {
        const tableContainer = document.getElementById('bet-table');
        const bets = this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge);

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Bet Type</th>
                        <th>House Edge</th>
                        <th>Win Prob.</th>
                        <th>Payout</th>
                    </tr>
                </thead>
                <tbody>
        `;

        bets.forEach(bet => {
            const edgeClass = this.getEdgeClass(bet.houseEdge);
            html += `
                <tr>
                    <td><strong>${bet.name}</strong><br><small>${bet.description}</small></td>
                    <td class="${edgeClass}">${bet.houseEdge}%</td>
                    <td>${bet.probability.toFixed(2)}%</td>
                    <td>${bet.payout}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
    }

    updateInsights() {
        const insightsContainer = document.getElementById('insights-content');
        const insights = this.currentGame.getInsights();

        let html = '<ul>';
        insights.forEach(insight => {
            html += `<li>${insight}</li>`;
        });
        html += '</ul>';

        insightsContainer.innerHTML = html;
    }

    populateBetTypeSelect() {
        const select = document.getElementById('bet-type');
        const bets = this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge);

        select.innerHTML = '';
        bets.forEach((bet, index) => {
            const option = document.createElement('option');
            option.value = bet.name;
            option.textContent = `${bet.name} (${bet.houseEdge}% edge)`;
            if (index === 0) option.selected = true;
            select.appendChild(option);
        });
    }

    updatePlaytimeCalculator() {
        const bankroll = parseFloat(document.getElementById('bankroll').value) || 100;
        const betAmount = parseFloat(document.getElementById('bet-amount').value) || 5;
        const betType = document.getElementById('bet-type').value;

        if (bankroll < betAmount) {
            document.getElementById('playtime-results').innerHTML = `
                <p style="color: #e74c3c; font-weight: bold;">⚠️ Bet amount cannot exceed bankroll!</p>
            `;
            return;
        }

        const results = this.currentGame.estimatePlaytime(bankroll, betAmount, betType);

        if (!results) return;

        const html = `
            <div class="result-row">
                <span class="result-label">Estimated Hands/Spins:</span>
                <span class="result-value">${results.estimatedBets.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Estimated Play Time:</span>
                <span class="result-value">${results.estimatedHours} hours</span>
            </div>
            <div class="result-row">
                <span class="result-label">Expected Loss:</span>
                <span class="result-value" style="color: #e74c3c;">$${results.expectedLoss}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Risk of Ruin:</span>
                <span class="result-value">${results.riskOfRuin}%</span>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #6c757d; font-style: italic;">
                These are estimates based on mathematical probability. Actual results will vary due to variance.
            </p>
        `;

        document.getElementById('playtime-results').innerHTML = html;
    }

    getColorForEdge(edge, alpha = 0.6) {
        if (edge < 0) return `rgba(39, 174, 96, ${alpha})`; // Green - player advantage
        if (edge < 2) return `rgba(52, 152, 219, ${alpha})`; // Blue - good
        if (edge < 5) return `rgba(243, 156, 18, ${alpha})`; // Orange - medium
        return `rgba(231, 76, 60, ${alpha})`; // Red - bad
    }

    getEdgeClass(edge) {
        if (edge < 2) return 'edge-good';
        if (edge < 5) return 'edge-medium';
        return 'edge-bad';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CasinoAnalyzerApp();
});
