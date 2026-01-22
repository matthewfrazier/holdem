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
            },
            'card-counting': {
                title: 'Card Counting',
                content: `
                    <p><strong>A technique to track the ratio of high to low cards remaining in the deck to gain an advantage.</strong></p>
                    <p>Card counters keep a running count of cards played to determine when the remaining deck favors the player. When the count is favorable (more high cards remaining), skilled counters increase their bets.</p>
                    <p><strong>Key facts:</strong></p>
                    <ul>
                        <li>Not illegal, but casinos will ask you to leave if detected</li>
                        <li>Requires significant practice and mental discipline</li>
                        <li>Can provide a 0.5-1.5% edge over the house with perfect play</li>
                        <li>Needs large bankroll to weather variance</li>
                        <li>Modern casinos use countermeasures: multiple decks, shuffle machines, bet limits</li>
                    </ul>
                `
            },
            'deck-penetration': {
                title: 'Deck Penetration',
                content: `
                    <p><strong>How far into the shoe the dealer deals before shuffling.</strong></p>
                    <p>Good penetration means dealing deeper into the shoe (e.g., 75-80% of cards dealt). This is crucial for card counters because it allows the count to become more accurate and extreme, creating more advantageous situations.</p>
                    <p><strong>Why it matters:</strong></p>
                    <ul>
                        <li>Better penetration = more profitable for card counters</li>
                        <li>Casinos often cut off 1-2 decks in 6-deck shoes to reduce counting effectiveness</li>
                        <li>Meaningless for basic strategy players</li>
                    </ul>
                `
            },
            'player-advantage': {
                title: 'Player Advantage',
                content: `
                    <p><strong>A rare situation where the mathematical odds favor the player instead of the house.</strong></p>
                    <p>In most casino games, the house always has the edge. Player advantage can occur in:</p>
                    <ul>
                        <li><strong>Blackjack with card counting:</strong> Skilled counters can achieve 0.5-1.5% edge</li>
                        <li><strong>Poker:</strong> Playing against other players, not the house</li>
                        <li><strong>Sports betting:</strong> With sufficient skill in finding mispriced lines</li>
                        <li><strong>Video poker:</strong> Some full-pay machines with perfect play (rare)</li>
                    </ul>
                    <p>When you have a true player advantage, the expected value is positive – you make money over time.</p>
                `
            },
            's17': {
                title: 'S17 (Dealer Stands on Soft 17)',
                content: `
                    <p><strong>A blackjack rule where the dealer must stand when holding an Ace-6 (soft 17).</strong></p>
                    <p>A "soft" hand contains an Ace counted as 11. When the dealer stands on soft 17 (S17), it's better for the player because the dealer can't improve a mediocre hand.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>S17 reduces house edge by approximately 0.2%</li>
                        <li>This is one of the most important rule variations</li>
                        <li>Always look for S17 tables over H17 (hit soft 17)</li>
                    </ul>
                `
            },
            'h17': {
                title: 'H17 (Dealer Hits Soft 17)',
                content: `
                    <p><strong>A blackjack rule where the dealer must hit when holding an Ace-6 (soft 17).</strong></p>
                    <p>When the dealer hits soft 17, they have more opportunities to improve their hand, which increases the house edge by approximately 0.2% compared to S17 rules.</p>
                    <p><strong>Avoid H17 tables when possible</strong> – this rule significantly favors the house. Look for tables that say "Dealer stands on all 17s" or "S17".</p>
                `
            },
            'surrender': {
                title: 'Surrender',
                content: `
                    <p><strong>An option to forfeit your hand and lose half your bet before playing it out.</strong></p>
                    <p><strong>Late Surrender:</strong> Allowed after the dealer checks for blackjack (most common). Reduces house edge by ~0.07%.</p>
                    <p><strong>Early Surrender:</strong> Allowed before dealer checks for blackjack (very rare). Reduces house edge by ~0.6%.</p>
                    <p><strong>When to surrender:</strong></p>
                    <ul>
                        <li>16 vs dealer's 9, 10, or Ace</li>
                        <li>15 vs dealer's 10</li>
                        <li>Specific situations vary by number of decks and other rules</li>
                    </ul>
                    <p>Surrender is underused by casual players but is a valuable tool for reducing losses in bad situations.</p>
                `
            },
            'insurance': {
                title: 'Insurance',
                content: `
                    <p><strong>A side bet offered when the dealer shows an Ace, betting that the dealer has blackjack.</strong></p>
                    <p>Insurance pays 2:1 and costs half your original bet. Sounds protective, but it's actually a sucker bet with a 7.4% house edge.</p>
                    <p><strong>Why it's bad:</strong></p>
                    <ul>
                        <li>Only 30.8% of the time will the dealer have a 10 under that Ace</li>
                        <li>For insurance to break even, 33.3% of remaining cards would need to be tens</li>
                        <li>The math never works out in the player's favor (unless card counting)</li>
                    </ul>
                    <p><strong>NEVER take insurance</strong> unless you're a card counter and the count is very favorable.</p>
                `
            },
            'blackjack-payout': {
                title: 'Blackjack Payout (3:2 vs 6:5)',
                content: `
                    <p><strong>How much you win when you get a natural blackjack (Ace + Ten).</strong></p>
                    <p><strong>3:2 payout (GOOD):</strong> Win $15 on a $10 bet – this is the traditional and fair payout.</p>
                    <p><strong>6:5 payout (BAD):</strong> Win only $12 on a $10 bet – adds ~1.4% to the house edge!</p>
                    <p><strong>Critical advice:</strong></p>
                    <ul>
                        <li><strong>NEVER play 6:5 blackjack</strong> – it's one of the worst rule changes casinos have introduced</li>
                        <li>That 1.4% increase nearly triples the house edge on a good game</li>
                        <li>6:5 games are often disguised with lower minimums or flashy tables</li>
                        <li>Always check the felt or ask the dealer before sitting down</li>
                    </ul>
                `
            },
            'double-after-split': {
                title: 'Double After Split (DAS)',
                content: `
                    <p><strong>A rule allowing you to double down after splitting a pair.</strong></p>
                    <p>When you split a pair (like 8-8), DAS lets you double your bet on one or both of the new hands if you get a favorable card.</p>
                    <p><strong>Example:</strong> Split 8-8, get dealt a 3 on the first 8 (now 11), DAS allows you to double down.</p>
                    <p><strong>Impact:</strong> Reduces house edge by approximately 0.15%. This is a player-favorable rule you should actively seek out.</p>
                `
            },
            'pass-line': {
                title: 'Pass Line (Craps)',
                content: `
                    <p><strong>The most fundamental bet in craps, wagering that the shooter will win.</strong></p>
                    <p><strong>How it works:</strong></p>
                    <ul>
                        <li><strong>Come-out roll:</strong> Win on 7 or 11, lose on 2, 3, or 12</li>
                        <li><strong>After point established:</strong> Win if point is rolled before 7</li>
                        <li>House edge: 1.41%</li>
                    </ul>
                    <p><strong>With odds:</strong> After a point is established, you can take "odds" (a bet with 0% house edge), which lowers the combined house edge significantly.</p>
                    <p>Pass Line + max odds is one of the best bets in the casino.</p>
                `
            },
            'dont-pass': {
                title: 'Don\'t Pass (Craps)',
                content: `
                    <p><strong>Betting against the shooter – you win when they lose.</strong></p>
                    <p><strong>How it works:</strong></p>
                    <ul>
                        <li><strong>Come-out roll:</strong> Win on 2 or 3, lose on 7 or 11, push on 12</li>
                        <li><strong>After point established:</strong> Win if 7 rolls before the point</li>
                        <li>House edge: 1.36% (slightly better than Pass Line)</li>
                    </ul>
                    <p>Don't Pass is mathematically superior to Pass Line, but you'll be rooting against everyone else at the table, which can feel socially awkward.</p>
                `
            },
            'come-bet': {
                title: 'Come Bet (Craps)',
                content: `
                    <p><strong>A bet identical to Pass Line, but made after the come-out roll.</strong></p>
                    <p>Works exactly like Pass Line: next roll establishes your personal "come point," then you win if that number hits before 7.</p>
                    <p><strong>Advantage:</strong> Allows you to make additional contract bets and take odds on multiple numbers simultaneously.</p>
                    <p>House edge: 1.41% (same as Pass Line), reduced significantly when taking odds.</p>
                `
            },
            'place-bets': {
                title: 'Place Bets (Craps)',
                content: `
                    <p><strong>Betting directly that a specific number (4, 5, 6, 8, 9, or 10) will roll before a 7.</strong></p>
                    <p><strong>House edges by number:</strong></p>
                    <ul>
                        <li><strong>6 and 8:</strong> 1.52% (best place bets)</li>
                        <li><strong>5 and 9:</strong> 4.00%</li>
                        <li><strong>4 and 10:</strong> 6.67% (worst place bets)</li>
                    </ul>
                    <p><strong>Strategy:</strong> Only make place bets on 6 and 8. The house edge on other numbers is too high. Better yet, use Pass/Come with odds instead.</p>
                `
            },
            'field-bet': {
                title: 'Field Bet (Craps)',
                content: `
                    <p><strong>A one-roll bet that wins if the next roll is 2, 3, 4, 9, 10, 11, or 12.</strong></p>
                    <p>Loses on 5, 6, 7, or 8. Usually pays even money on most numbers, 2:1 on 2 and 12.</p>
                    <p><strong>House edge:</strong> Typically 2.78-5.56% depending on payouts.</p>
                    <p><strong>Analysis:</strong> Looks appealing because you win on 7 out of 11 possible totals, but the probabilities don't match the payouts. It's a sucker bet – avoid it.</p>
                `
            },
            'proposition-bets': {
                title: 'Proposition Bets (Craps)',
                content: `
                    <p><strong>High-risk, one-roll bets in the center of the craps table with terrible odds.</strong></p>
                    <p><strong>Examples and house edges:</strong></p>
                    <ul>
                        <li><strong>Any 7:</strong> 16.67% house edge</li>
                        <li><strong>Any Craps (2,3,12):</strong> 11.11%</li>
                        <li><strong>Hard Ways:</strong> 9.09-11.11%</li>
                        <li><strong>Horn Bets:</strong> 12.5%+</li>
                    </ul>
                    <p><strong>Advice: NEVER make proposition bets.</strong> They're designed to look exciting but are mathematically terrible. Stick to Pass/Don't Pass with odds.</p>
                `
            },
            'point': {
                title: 'Point (Craps)',
                content: `
                    <p><strong>A number (4, 5, 6, 8, 9, or 10) established on the come-out roll.</strong></p>
                    <p>After the point is set, the goal becomes to roll that number again before rolling a 7. If the point hits, Pass Line bets win. If 7 rolls first, Pass Line loses.</p>
                    <p><strong>Probabilities:</strong></p>
                    <ul>
                        <li><strong>6 and 8:</strong> Best points (5 ways to make vs 6 ways to roll 7)</li>
                        <li><strong>5 and 9:</strong> Medium (4 ways vs 6)</li>
                        <li><strong>4 and 10:</strong> Worst points (3 ways vs 6)</li>
                    </ul>
                    <p>Once a point is set, you can make odds bets, which pay true odds and have 0% house edge.</p>
                `
            },
            'win-probability': {
                title: 'Win Probability',
                content: `
                    <p><strong>The mathematical chance of winning a particular bet, expressed as a percentage.</strong></p>
                    <p>This is different from house edge. A bet can have high win probability but still favor the house if the payout doesn't match the true odds.</p>
                    <p><strong>Example:</strong> Betting on red in roulette has ~47% win probability (18/38), but pays even money. The house edge comes from paying even money on a less-than-50% bet.</p>
                `
            },
            'payout': {
                title: 'Payout',
                content: `
                    <p><strong>How much you win relative to your bet, expressed as a ratio (e.g., 3:2, 35:1).</strong></p>
                    <p><strong>Common payouts:</strong></p>
                    <ul>
                        <li><strong>1:1 (Even money):</strong> Win same as bet ($10 bet wins $10)</li>
                        <li><strong>3:2:</strong> Win 1.5× bet ($10 bet wins $15)</li>
                        <li><strong>2:1:</strong> Win 2× bet ($10 bet wins $20)</li>
                        <li><strong>35:1:</strong> Win 35× bet ($10 bet wins $350)</li>
                    </ul>
                    <p>The house edge exists when payouts are less than the true odds of winning.</p>
                `
            }
        };
    }

    // Helper to wrap term text with link markup
    wrapTerms(text) {
        const terms = {
            // Blackjack terms
            'Card Counting': 'card-counting',
            'Basic Strategy': 'basic-strategy',
            'Perfect basic strategy': 'basic-strategy',
            'Good Rules': 'good-rules',
            'Favorable rules': 'good-rules',
            'Good Penetration': 'deck-penetration',
            'Player advantage': 'player-advantage',
            'S17': 's17',
            'H17': 'h17',
            'Late surrender': 'surrender',
            'Insurance': 'insurance',
            'taking insurance': 'insurance',
            '3:2': 'blackjack-payout',
            '6:5': 'blackjack-payout',
            'Double after split': 'double-after-split',
            'DAS': 'double-after-split',

            // Craps terms
            'Pass Line': 'pass-line',
            'Don\'t Pass': 'dont-pass',
            'Come': 'come-bet',
            'Place Bets': 'place-bets',
            'Place bet': 'place-bets',
            'Field': 'field-bet',
            'Proposition bets': 'proposition-bets',
            'Point': 'point',

            // General terms
            'house edge': 'house-edge',
            'House Edge': 'house-edge',
            'Expected Value': 'expected-value',
            'Odds': 'odds-bet',
            'odds bet': 'odds-bet',
            'Odds Bet': 'odds-bet',
            'Variance': 'variance',
            'Bankroll': 'bankroll',
            'Win Probability': 'win-probability',
            'Payout': 'payout'
        };

        let result = text;
        // Sort by length (longest first) to avoid partial matches
        const sortedTerms = Object.entries(terms).sort((a, b) => b[0].length - a[0].length);

        for (const [term, id] of sortedTerms) {
            const regex = new RegExp(`\\b(${term.replace(/[()]/g, '\\$&')})\\b`, 'gi');
            result = result.replace(regex, (match) => {
                // Don't wrap if already wrapped
                if (result.includes(`data-term="${id}">${match}</span>`)) return match;
                return `<span class="term-link" data-term="${id}" data-tooltip="Click to learn more">${match}</span>`;
            });
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

        const chart = new Chart(ctx, {
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
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                // Show full name in tooltip
                                return bets[items[0].dataIndex].name;
                            },
                            afterLabel: () => '💡 Click to learn more'
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: { size: 10 },
                            color: '#3498db'  // Make labels blue to indicate clickability
                        }
                    }
                },
                onClick: (event, elements, chart) => {
                    // Handle click on bar
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const betName = bets[index].name;
                        this.showTermFromText(betName);
                        return;
                    }

                    // Handle click on label area
                    const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
                    const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);

                    if (dataX !== null && dataX >= 0 && dataX < bets.length) {
                        const index = Math.round(dataX);
                        const betName = bets[index].name;
                        this.showTermFromText(betName);
                    }
                }
            }
        });

        // Make canvas cursor pointer on hover
        ctx.style.cursor = 'pointer';

        // Store bets data with chart for reference
        chart._betsData = bets;

        this.charts[canvasId] = chart;
    }

    // Helper to find and show term from text
    showTermFromText(text) {
        const terms = {
            // Blackjack strategies
            'Card Counting': 'card-counting',
            'Basic Strategy': 'basic-strategy',
            'Good Rules': 'good-rules',
            'Average Rules': 'good-rules',
            'Good Penetration': 'deck-penetration',
            'Casual Play': 'basic-strategy',
            'Few Mistakes': 'basic-strategy',
            'Poor Strategy': 'basic-strategy',
            'Terrible Play': 'good-rules',
            'Bad Rules': 'good-rules',

            // Craps bets
            'Pass Line': 'pass-line',
            'Don\'t Pass': 'dont-pass',
            'Come': 'come-bet',
            'Place 6': 'place-bets',
            'Place 8': 'place-bets',
            'Place': 'place-bets',
            'Field': 'field-bet',
            'Proposition': 'proposition-bets',
            'Any 7': 'proposition-bets',
            'Any Craps': 'proposition-bets',
            'Hard': 'proposition-bets',

            // Roulette
            'Single Number': 'payout',
            'Red/Black': 'payout',
            'Even/Odd': 'payout',

            // Baccarat
            'Banker': 'payout',
            'Player': 'payout',
            'Tie': 'payout'
        };

        // Find matching term (check longest matches first)
        const sortedTerms = Object.entries(terms).sort((a, b) => b[0].length - a[0].length);
        for (const [term, id] of sortedTerms) {
            if (text.includes(term)) {
                this.showTermModal(id);
                return;
            }
        }

        // If no specific term found, show a general explanation based on game
        if (text.includes('Blackjack') || text.includes('BJ')) {
            this.showTermModal('basic-strategy');
        } else if (text.includes('Craps')) {
            this.showTermModal('pass-line');
        } else if (text.includes('edge') || text.includes('Edge')) {
            this.showTermModal('house-edge');
        }
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
