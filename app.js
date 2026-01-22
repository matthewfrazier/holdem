// Casino Game Analyzer - Main Application
class CasinoAnalyzerApp {
    constructor() {
        this.currentGame = CrapsAnalyzer;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupGlossary();
        this.setupTermModal();
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

    setupGlossary() {
        // Setup expandable term definitions
        document.querySelectorAll('.term-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const termCard = e.currentTarget.closest('.term-card');
                const isExpanded = termCard.classList.contains('expanded');

                // Close all other terms
                document.querySelectorAll('.term-card.expanded').forEach(card => {
                    if (card !== termCard) {
                        card.classList.remove('expanded');
                    }
                });

                // Toggle current term
                termCard.classList.toggle('expanded');
            });
        });
    }

    setupTermModal() {
        const modal = document.getElementById('term-modal');
        const backdrop = modal.querySelector('.term-modal-backdrop');
        const closeBtn = modal.querySelector('.term-modal-close');

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            // Remove history entry if added
            if (this.modalHistoryState) {
                this.modalHistoryState = false;
            }
        };

        // Click on backdrop to close
        backdrop.addEventListener('click', closeModal);

        // Click close button
        closeBtn.addEventListener('click', closeModal);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Handle browser back button
        window.addEventListener('popstate', (e) => {
            if (this.modalHistoryState && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Delegate click handling for term links (since they're added dynamically)
        document.body.addEventListener('click', (e) => {
            const termLink = e.target.closest('.term-link');
            if (termLink) {
                e.preventDefault();
                const termId = termLink.dataset.term;
                this.showTermModal(termId);
            }
        });
    }

    showTermModal(termId) {
        const definitions = this.getTermDefinitions();
        const term = definitions[termId];

        if (!term) return;

        const modal = document.getElementById('term-modal');
        const title = modal.querySelector('.term-modal-title');
        const body = modal.querySelector('.term-modal-body');

        title.textContent = term.title;
        body.innerHTML = term.content;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Add history entry for back button support on mobile
        if (window.history.pushState) {
            this.modalHistoryState = true;
            window.history.pushState({ modal: true }, '');
        }
    }

    getTermDefinitions() {
        return {
            'house-edge': {
                title: 'House Edge',
                content: `
                    <p><strong>The casino's mathematical advantage expressed as a percentage of your bet.</strong></p>
                    <p>For example, a 5% house edge means that for every $100 you bet, you can expect to lose $5 on average over time. This doesn't mean you'll lose exactly $5 every time – you might win or lose in the short term – but over thousands of bets, the math works out to this average.</p>
                    <p><strong>Key points:</strong></p>
                    <ul>
                        <li>Lower house edge = better odds for the player</li>
                        <li>The house edge never changes, regardless of betting systems</li>
                        <li>It's calculated from the true odds vs. the payout odds</li>
                    </ul>
                `
            },
            'expected-value': {
                title: 'Expected Value (EV)',
                content: `
                    <p><strong>The average amount you can expect to win or lose per bet over time.</strong></p>
                    <p>Expected Value is calculated by multiplying each possible outcome by its probability. In casino games, the EV is almost always negative for the player (positive for the house).</p>
                    <p><strong>Example:</strong> If a bet has -$5.26 EV per $100, you can expect to lose $5.26 for every $100 wagered on average.</p>
                `
            },
            'basic-strategy': {
                title: 'Basic Strategy (Blackjack)',
                content: `
                    <p><strong>The mathematically optimal way to play every hand in blackjack.</strong></p>
                    <p>Basic strategy is a set of rules that tells you the best decision (hit, stand, double, split) for every possible combination of your cards and the dealer's up card. It's been computed using millions of simulations and probability calculations.</p>
                    <p><strong>Using basic strategy correctly:</strong></p>
                    <ul>
                        <li>Reduces the house edge to around 0.5%</li>
                        <li>Requires memorization or using a strategy card</li>
                        <li>Varies slightly based on table rules</li>
                        <li>Does NOT guarantee winning, but minimizes losses over time</li>
                    </ul>
                `
            },
            'good-rules': {
                title: 'Good Rules (Blackjack)',
                content: `
                    <p><strong>Table rules that are favorable to the player and reduce the house edge.</strong></p>
                    <p><strong>Player-favorable rules include:</strong></p>
                    <ul>
                        <li><strong>Blackjack pays 3:2</strong> (not 6:5) – This is critical! 6:5 adds ~1.4% to house edge</li>
                        <li><strong>Dealer stands on soft 17</strong> (S17) – Reduces house edge by ~0.2%</li>
                        <li><strong>Double after split allowed</strong> (DAS) – Reduces house edge by ~0.15%</li>
                        <li><strong>Late surrender</strong> – Reduces house edge by ~0.07%</li>
                        <li><strong>Fewer decks</strong> – Single deck is best, but rare with good rules</li>
                        <li><strong>Resplit aces</strong> – Small advantage for player</li>
                    </ul>
                    <p><strong>Bad rules to avoid:</strong> 6:5 blackjack, dealer hits soft 17 (H17), no double after split, no surrender</p>
                `
            },
            'odds-bet': {
                title: 'Odds Bet (Craps)',
                content: `
                    <p><strong>The only bet in the casino that has zero house edge – it pays true odds.</strong></p>
                    <p>After establishing a point in craps, you can place an additional bet behind your Pass/Don't Pass line bet. This "odds bet" pays exactly according to the true mathematical probability of winning.</p>
                    <p><strong>Odds bet payouts:</strong></p>
                    <ul>
                        <li>Point is 4 or 10: Pays 2:1 (true odds)</li>
                        <li>Point is 5 or 9: Pays 3:2</li>
                        <li>Point is 6 or 8: Pays 6:5</li>
                    </ul>
                    <p><strong>The more odds you take, the lower your combined house edge.</strong> For example, with 3-4-5x odds, the combined house edge drops from 1.41% to around 0.37%.</p>
                    <p><strong>Catch:</strong> You must make a Pass/Don't Pass bet first, which does have a house edge. The odds bet doesn't eliminate that, but it dilutes it.</p>
                `
            },
            'true-odds': {
                title: 'True Odds vs. Payout Odds',
                content: `
                    <p><strong>True odds are the actual mathematical probability of winning. Payout odds are what the casino pays you.</strong></p>
                    <p><strong>Example:</strong> In American roulette, betting on a single number has:</p>
                    <ul>
                        <li><strong>True odds:</strong> 37:1 (37 ways to lose, 1 way to win)</li>
                        <li><strong>Payout odds:</strong> 35:1 (casino only pays 35 to 1)</li>
                        <li><strong>The difference is the house edge</strong> – the casino keeps that 2-unit difference</li>
                    </ul>
                    <p>The house edge exists because casinos pay less than true odds on winning bets. The only exception is the odds bet in craps, which pays true odds.</p>
                `
            },
            'bankroll': {
                title: 'Bankroll Management',
                content: `
                    <p><strong>The total amount of money you've set aside for gambling, and how you manage it.</strong></p>
                    <p><strong>Basic principles:</strong></p>
                    <ul>
                        <li><strong>Never gamble with money you can't afford to lose</strong></li>
                        <li><strong>Set a loss limit</strong> before you start playing and stick to it</li>
                        <li><strong>Bet sizing:</strong> Each bet should be 1-5% of your total bankroll</li>
                        <li><strong>Avoid chasing losses</strong> – increasing bets to "win back" losses usually makes things worse</li>
                        <li><strong>Take breaks</strong> when you're up or down significantly</li>
                    </ul>
                    <p>Good bankroll management can't overcome the house edge, but it can help you play longer and avoid catastrophic losses.</p>
                `
            },
            'variance': {
                title: 'Variance & Standard Deviation',
                content: `
                    <p><strong>Variance measures how much your actual results can differ from expected value in the short term.</strong></p>
                    <p>High variance games (like blackjack or single number roulette bets) have bigger swings – you can win or lose a lot quickly. Low variance games (like baccarat banker bets) have smaller, more consistent results.</p>
                    <p><strong>Why it matters:</strong></p>
                    <ul>
                        <li>High variance = bigger swings = need larger bankroll</li>
                        <li>Low variance = steadier results = can play longer with smaller bankroll</li>
                        <li>Variance doesn't change the house edge – you still lose the same amount on average</li>
                    </ul>
                    <p><strong>Standard deviation</strong> is the square root of variance and measures the typical amount your results differ from average.</p>
                `
            }
        };
    }

    // Helper to wrap term text with link markup
    wrapTerms(text) {
        const terms = {
            'Basic Strategy': 'basic-strategy',
            'Good Rules': 'good-rules',
            'house edge': 'house-edge',
            'House Edge': 'house-edge',
            'Expected Value': 'expected-value',
            'Odds': 'odds-bet',
            'odds bet': 'odds-bet',
            'Odds Bet': 'odds-bet'
        };

        let result = text;
        for (const [term, id] of Object.entries(terms)) {
            const regex = new RegExp(`\\b(${term})\\b`, 'g');
            result = result.replace(regex, `<span class="term-link" data-term="${id}" data-tooltip="Click to learn more">$1</span>`);
        }
        return result;
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
                    <div class="strategy-item-name">${this.wrapTerms(s.name)}</div>
                    <div class="strategy-item-detail">${this.wrapTerms(s.detail)}</div>
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

        if (bestBetEl) bestBetEl.innerHTML = this.wrapTerms(best.name);
        if (bestEdgeEl) bestEdgeEl.innerHTML = this.wrapTerms(`${best.houseEdge}% house edge`);
        if (worstBetEl) worstBetEl.innerHTML = this.wrapTerms(worst.name);
        if (worstEdgeEl) worstEdgeEl.innerHTML = this.wrapTerms(`${worst.houseEdge}% house edge`);
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
                                <span class="bet-name-cell">${this.wrapTerms(bet.name)}</span>
                                <span class="bet-desc">${this.wrapTerms(bet.description)}</span>
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
        container.innerHTML = `<ul>${insights.map(i => `<li>${this.wrapTerms(i)}</li>`).join('')}</ul>`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => new CasinoAnalyzerApp());
