// Casino Game Analyzer - Main Application
class CasinoAnalyzerApp {
    constructor() {
        this.currentGame = CrapsAnalyzer;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGame(CrapsAnalyzer);
    }

    setupEventListeners() {
        // Game buttons
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadGameByName(e.target.dataset.game);
            });
        });

        // Settings inputs - update on change
        ['bankroll', 'table-min', 'table-max', 'max-odds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => this.updateAnalysis());
                el.addEventListener('input', () => this.debounceUpdate());
            }
        });
    }

    debounceUpdate() {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => this.updateAnalysis(), 300);
    }

    loadGameByName(name) {
        const games = {
            'craps': CrapsAnalyzer,
            'roulette': RouletteAnalyzer,
            'baccarat': BaccaratAnalyzer,
            'blackjack': BlackjackAnalyzer
        };
        const game = games[name];
        if (game) {
            if (game.setVariation) game.setVariation(game.variations[0]);
            this.loadGame(game);
        }
    }

    loadGame(game) {
        this.currentGame = game;
        this.updateVariationTabs();
        this.updateTitle();
        this.updateTableSettings();
        this.updateAnalysis();
        this.updateCharts();
        this.updateBetTable();
        this.updateInsights();
        this.updateSummaryStats();
    }

    updateVariationTabs() {
        const container = document.getElementById('variation-tabs');
        if (!container) return;

        if (!this.currentGame.variations || this.currentGame.variations.length <= 1) {
            container.innerHTML = '';
            return;
        }

        const info = this.currentGame.getVariationInfo();
        container.innerHTML = info.available.map(v =>
            `<button class="variation-tab ${v.id === info.current ? 'active' : ''}"
                     data-variation="${v.id}">${v.name}</button>`
        ).join('');

        container.querySelectorAll('.variation-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentGame.setVariation(e.target.dataset.variation);
                this.loadGame(this.currentGame);
            });
        });
    }

    updateTitle() {
        const title = document.getElementById('game-title');
        if (!title) return;

        let name = this.currentGame.name;
        if (this.currentGame.getVariationInfo) {
            const info = this.currentGame.getVariationInfo();
            const current = info.available.find(v => v.id === info.current);
            if (current) name = current.name;
        }
        title.textContent = `${name} Analysis`;
    }

    updateTableSettings() {
        const section = document.getElementById('table-settings');
        if (!section) return;

        // Show table settings only for craps
        const isCraps = this.currentGame.name === 'Craps';
        section.style.display = isCraps ? 'block' : 'none';
    }

    getSettings() {
        return {
            bankroll: parseFloat(document.getElementById('bankroll')?.value) || 500,
            tableMin: parseFloat(document.getElementById('table-min')?.value) || 15,
            tableMax: parseFloat(document.getElementById('table-max')?.value) || 1000,
            maxOdds: document.getElementById('max-odds')?.value || '3-4-5'
        };
    }

    updateAnalysis() {
        this.updateStrategySection();
        this.updateSimulationSection();
    }

    updateStrategySection() {
        const section = document.getElementById('strategy-section');
        const content = document.getElementById('strategy-content');
        if (!section || !content) return;

        // Only show for craps
        if (this.currentGame.name !== 'Craps' || !this.currentGame.generateBettingStrategy) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const { bankroll, tableMin, tableMax, maxOdds } = this.getSettings();
        const strategy = this.currentGame.generateBettingStrategy(bankroll, tableMin, tableMax, maxOdds);

        content.innerHTML = strategy.map(s => `
            <div class="strategy-item ${s.type === 'place' ? 'place-bet' : ''}">
                <div class="strategy-item-info">
                    <div class="strategy-item-name">${s.name}</div>
                    <div class="strategy-item-detail">${s.detail}</div>
                </div>
                <div class="strategy-item-amount">${s.amount}</div>
            </div>
        `).join('');
    }

    updateSimulationSection() {
        const section = document.getElementById('simulation-section');
        const content = document.getElementById('simulation-content');
        if (!section || !content) return;

        // Only show for craps
        if (this.currentGame.name !== 'Craps' || !this.currentGame.runSimulation) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const { bankroll, tableMin, maxOdds } = this.getSettings();

        // Run simulation
        const sim = this.currentGame.runSimulation(bankroll, tableMin, maxOdds, 1000, 4);

        content.innerHTML = `
            <div class="simulation-stats">
                <div class="sim-stat">
                    <div class="sim-stat-label">Bust Rate (4hr)</div>
                    <div class="sim-stat-value ${parseFloat(sim.bustRate) > 50 ? 'negative' : ''}">${sim.bustRate}%</div>
                </div>
                <div class="sim-stat">
                    <div class="sim-stat-label">Win Rate</div>
                    <div class="sim-stat-value ${parseFloat(sim.winRate) > 40 ? 'positive' : ''}">${sim.winRate}%</div>
                </div>
                <div class="sim-stat">
                    <div class="sim-stat-label">Avg Outcome</div>
                    <div class="sim-stat-value ${sim.avgEndBankroll < bankroll ? 'negative' : 'positive'}">$${sim.avgEndBankroll}</div>
                </div>
                <div class="sim-stat">
                    <div class="sim-stat-label">Expected Loss</div>
                    <div class="sim-stat-value negative">$${sim.expectedLoss}</div>
                </div>
            </div>
            <div class="simulation-note">
                Based on 1,000 simulated 4-hour sessions. Best 10%: $${sim.best10Pct}, Worst 10%: $${sim.worst10Pct}
            </div>
        `;
    }

    updateSummaryStats() {
        const best = this.currentGame.getBestBet();
        const worst = this.currentGame.getWorstBet();

        const bestBetEl = document.getElementById('best-bet');
        const bestEdgeEl = document.getElementById('best-edge');
        const worstBetEl = document.getElementById('worst-bet');
        const worstEdgeEl = document.getElementById('worst-edge');

        if (bestBetEl) bestBetEl.textContent = best.name;
        if (bestEdgeEl) bestEdgeEl.textContent = `${best.houseEdge}% edge`;
        if (worstBetEl) worstBetEl.textContent = worst.name;
        if (worstEdgeEl) worstEdgeEl.textContent = `${worst.houseEdge}% edge`;
    }

    updateCharts() {
        this.createChart('houseEdgeChart', 'House Edge %',
            this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge).slice(0, 8),
            b => b.houseEdge,
            b => this.getEdgeColor(b.houseEdge)
        );

        this.createChart('expectedValueChart', 'Expected Loss per $100',
            this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge).slice(0, 8),
            b => b.houseEdge, // EV is proportional to edge
            () => 'rgba(231, 76, 60, 0.7)'
        );

        this.createChart('probabilityChart', 'Win Probability %',
            this.currentGame.bets.slice().sort((a, b) => b.probability - a.probability).slice(0, 8),
            b => b.probability,
            () => 'rgba(52, 152, 219, 0.7)'
        );
    }

    createChart(canvasId, label, bets, valueFn, colorFn) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bets.map(b => b.name.length > 15 ? b.name.substring(0, 15) + '...' : b.name),
                datasets: [{
                    label,
                    data: bets.map(valueFn),
                    backgroundColor: bets.map(colorFn),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true },
                    x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
                }
            }
        });
    }

    getEdgeColor(edge) {
        if (edge < 2) return 'rgba(39, 174, 96, 0.7)';
        if (edge < 5) return 'rgba(243, 156, 18, 0.7)';
        return 'rgba(231, 76, 60, 0.7)';
    }

    updateBetTable() {
        const container = document.getElementById('bet-table');
        if (!container) return;

        const bets = this.currentGame.bets.slice().sort((a, b) => a.houseEdge - b.houseEdge);

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Bet</th>
                        <th>Edge</th>
                        <th>Win %</th>
                        <th>Payout</th>
                    </tr>
                </thead>
                <tbody>
                    ${bets.map(bet => `
                        <tr>
                            <td>
                                <span class="bet-name-cell">${bet.name}</span>
                                <span class="bet-desc">${bet.description}</span>
                            </td>
                            <td data-label="Edge" class="${this.getEdgeClass(bet.houseEdge)}">${bet.houseEdge}%</td>
                            <td data-label="Win %">${bet.probability.toFixed(1)}%</td>
                            <td data-label="Payout">${bet.payout}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getEdgeClass(edge) {
        if (edge < 2) return 'edge-good';
        if (edge < 5) return 'edge-medium';
        return 'edge-bad';
    }

    updateInsights() {
        const container = document.getElementById('insights-content');
        if (!container) return;

        const insights = this.currentGame.getInsights();
        container.innerHTML = `<ul>${insights.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => new CasinoAnalyzerApp());
