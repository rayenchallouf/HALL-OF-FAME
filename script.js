// Hacker Dashboard JavaScript

// Sample hacker data - you can replace this with real data
// Score is calculated as:
//   firstBlood * 20 + machines * 10 + writeUps * 15 + writeUps_score
// Level is automatically assigned based on rank: 1-5=Elite, 6-10=Advanced, 11-15=Intermediate, 16+=Beginner
let hackers = [
    { name: "Pl4gueZ", firstBlood: 3, machines: 5, writeUps: 5, writeUps_score: 120 },
    { name: "br0ker", firstBlood: 1, machines: 5, writeUps: 5, writeUps_score: 100 },
    { name: "Jesser", firstBlood: 1, machines: 2, writeUps: 2, writeUps_score: 40 },
    { name: "Bilil", firstBlood: 0, machines: 1, writeUps: 1, writeUps_score: 10 },
    { name: "try hack jemmali", firstBlood: 0, machines: 1, writeUps: 1, writeUps_score: 8 },
    { name: "koussay aydi", firstBlood: 1, machines: 1, writeUps: 1, writeUps_score: 30 },
    { name: "53", firstBlood: 0, machines: 1, writeUps: 1, writeUps_score: 9 },
    { name: "MaverickDeVacca", firstBlood: 0, machines: 1, writeUps: 1, writeUps_score: 7 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 },
    { name: ".....", firstBlood: 0, machines: 0, writeUps: 0, writeUps_score: 0 }
];

// Calculate score for each hacker using new scoring system
hackers.forEach(hacker => {
    hacker.score =
        (hacker.firstBlood * 20) +
        (hacker.machines * 10) +
        (hacker.writeUps * 15) +
        hacker.writeUps_score;
});

// Sort hackers by score (highest first) and assign ranks and levels
hackers.sort((a, b) => b.score - a.score);
hackers.forEach((hacker, index) => {
    hacker.rank = index + 1;
    
    // Automatically assign level based on rank
    if (hacker.rank <= 5) {
        hacker.level = "Elite";
    } else if (hacker.rank <= 10) {
        hacker.level = "Advanced";
    } else if (hacker.rank <= 15) {
        hacker.level = "Intermediate";
    } else {
        hacker.level = "Beginner";
    }
});

const medals = {
    1: "🥇",
    2: "🥈",
    3: "🥉"
};

let filteredHackers = [...hackers];
let currentLevelFilter = 'all';

// Initialize dashboard
function init() {
    renderStats();
    // Initialize with "all" filter to show all hackers
    filterHackers('', 'all');
    setupEventListeners();
    animateNumbers();
}

// Render statistics
function renderStats() {
    const totalHackers = hackers.length;
    const totalScore = hackers.reduce((sum, h) => sum + h.score, 0);
    const totalFirstBlood = hackers.reduce((sum, h) => sum + h.firstBlood, 0);
    const totalMachines = hackers.reduce((sum, h) => sum + h.machines, 0);
    const totalWriteUps = hackers.reduce((sum, h) => sum + h.writeUps, 0);

    const statsHTML = `
        <div class="stat-card">
            <div class="stat-value" data-target="${totalHackers}">0</div>
            <div class="stat-label">Total Hackers</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" data-target="${totalScore}">0</div>
            <div class="stat-label">Total Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" data-target="${totalFirstBlood}">0</div>
            <div class="stat-label">First Blood</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" data-target="${totalMachines}">0</div>
            <div class="stat-label">Machines</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" data-target="${totalWriteUps}">0</div>
            <div class="stat-label">Write-Ups</div>
        </div>
    `;

    const statsBar = document.getElementById('statsBar');
    if (statsBar) {
        statsBar.innerHTML = statsHTML;
    }
}

// Animate numbers
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Render podium
function renderPodium() {
    const podium = document.getElementById('podium');
    const topThree = filteredHackers.slice(0, 3);

    if (topThree.length === 0) {
        podium.innerHTML = '<p style="text-align: center; color: var(--hacker-cyan);">No hackers found</p>';
        return;
    }

    // Render in Olympic order: 2nd (left), 1st (center), 3rd (right)
    const orderedHackers = [
        { hacker: topThree[1], position: 'second', index: 1 }, // 2nd place - left
        { hacker: topThree[0], position: 'first', index: 0 },  // 1st place - center
        { hacker: topThree[2], position: 'third', index: 2 }   // 3rd place - right
    ];

    podium.innerHTML = orderedHackers.map(({ hacker, position }) => {
        const rank = hacker.rank;
        
        return `
            <div class="podium-place ${position}">
                <div class="player-info ${position}">
                    <div class="medal">${medals[rank] || ''}</div>
                    <div class="player-name">${hacker.name}</div>
                    <div class="player-score">${hacker.score} pts</div>
                    <div class="player-breakdown">
                        <div class="breakdown-item">
                            <span class="breakdown-label">🩸 FB:</span>
                            <span class="breakdown-value">${hacker.firstBlood}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">🖥 M:</span>
                            <span class="breakdown-value">${hacker.machines}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">📚 WU:</span>
                            <span class="breakdown-value">${hacker.writeUps}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.8em; margin-top: 5px; opacity: 0.8;">Level: ${hacker.level}</div>
                </div>
                <div class="podium-stand ${position}">
                    ${rank}
                </div>
            </div>
        `;
    }).join('');
}

// Render other hackers
function renderOtherHackers() {
    const hackersList = document.getElementById('hackersList');
    const otherHackers = window.listHackers || filteredHackers.slice(3);

    if (otherHackers.length === 0) {
        hackersList.innerHTML = '<p style="text-align: center; color: var(--hacker-cyan); padding: 20px;">No more hackers to display</p>';
        return;
    }

    hackersList.innerHTML = otherHackers.map((hacker, index) => {
        return `
            <div class="player-card" style="animation-delay: ${1.6 + (index * 0.1)}s">
                <div class="player-card-left">
                    <div class="rank-number">#${hacker.rank}</div>
                    <div class="player-details">
                        <h3>${hacker.name}</h3>
                        <p>Level: ${hacker.level} | writeUps_score: ${hacker.writeUps_score}</p>
                        <div class="player-stats-breakdown">
                            <span class="stat-badge first-blood">🩸 First Blood: ${hacker.firstBlood}</span>
                            <span class="stat-badge machines">🖥 Machines: ${hacker.machines}</span>
                            <span class="stat-badge writeups">📚 Write-Ups: ${hacker.writeUps}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score-badge">
                    ${hacker.score} pts
                    <div class="score-formula">
                        (${hacker.firstBlood} × 20) + (${hacker.machines} × 10) + (${hacker.writeUps} × 15) + ${hacker.writeUps_score}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterHackers(searchTerm, currentLevelFilter);
        });
    }

    // Filter buttons - only one active at a time
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            const filterGroup = btn.closest('.filter-group');
            
            // Remove active from all buttons in group
            filterGroup.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active to clicked button
            btn.classList.add('active');
            currentLevelFilter = filter;
            
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterHackers(searchTerm, currentLevelFilter);
        });
    });
    
    // Set "All" as default active
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
        allBtn.classList.add('active');
    }
}

// Filter hackers by search term and level filter
function filterHackers(searchTerm, levelFilter) {
    // First, get all hackers sorted with original ranks
    let allHackers = [...hackers];
    allHackers.sort((a, b) => b.score - a.score);
    allHackers.forEach((hacker, index) => {
        hacker.originalRank = index + 1;
        hacker.rank = index + 1;
        
        // Assign level based on original rank
        if (hacker.originalRank <= 5) {
            hacker.level = "Elite";
        } else if (hacker.originalRank <= 10) {
            hacker.level = "Advanced";
        } else if (hacker.originalRank <= 15) {
            hacker.level = "Intermediate";
        } else {
            hacker.level = "Beginner";
        }
    });
    
    let baseHackers = [...allHackers];
    
    // Apply level filter
    if (levelFilter && levelFilter !== 'all') {
        baseHackers = baseHackers.filter(hacker => {
            return hacker.level.toLowerCase() === levelFilter;
        });
    }
    
    // Apply search filter
    if (searchTerm) {
        baseHackers = baseHackers.filter(hacker => {
            return hacker.name.toLowerCase().includes(searchTerm);
        });
    }
    
    // Sort filtered hackers by score (for display order)
    baseHackers.sort((a, b) => b.score - a.score);
    
    // Always show top 3 in podium from filtered list
    filteredHackers = baseHackers;
    
    // Determine which hackers to show in the list based on level filter
    let listHackers = [];
    
    if (levelFilter === 'elite') {
        // Elite: top 3 (from Elite) + 2 others (ranks 4-5) = first 5 Elite
        listHackers = baseHackers.slice(3, 5);
    } else if (levelFilter === 'advanced') {
        // Advanced: top 3 (from Advanced) + players from original ranks 6-10
        listHackers = baseHackers.slice(3).filter(h => h.originalRank >= 6 && h.originalRank <= 10);
    } else if (levelFilter === 'intermediate') {
        // Intermediate: top 3 (from Intermediate) + players from original ranks 11-15
        listHackers = baseHackers.slice(3).filter(h => h.originalRank >= 11 && h.originalRank <= 15);
    } else if (levelFilter === 'beginner') {
        // Beginner: top 3 (from Beginner) + players from original rank 16+
        listHackers = baseHackers.slice(3).filter(h => h.originalRank >= 16);
    } else {
        // All: top 3 + all the rest
        listHackers = baseHackers.slice(3);
    }
    
    // Store list hackers separately for rendering
    window.listHackers = listHackers;

    renderPodium();
    renderOtherHackers();
}

// Add hacker (for testing or future use)
function addHacker(name, firstBlood, machines, writeUps, writeUps_score) {
    const score =
        (firstBlood * 20) +
        (machines * 10) +
        (writeUps * 15) +
        writeUps_score;

    const newHacker = {
        name,
        firstBlood,
        machines,
        writeUps,
        score,
        writeUps_score
    };
    hackers.push(newHacker);
    hackers.sort((a, b) => b.score - a.score);
    hackers.forEach((hacker, index) => {
        hacker.rank = index + 1;
        
        // Automatically assign level based on rank
        if (hacker.rank <= 5) {
            hacker.level = "Elite";
        } else if (hacker.rank <= 10) {
            hacker.level = "Advanced";
        } else if (hacker.rank <= 15) {
            hacker.level = "Intermediate";
        } else {
            hacker.level = "Beginner";
        }
    });
    init();
}

// Update hacker stats
function updateHackerStats(name, firstBlood, machines, writeUps) {
    const hacker = hackers.find(h => h.name === name);
    if (hacker) {
        hacker.firstBlood = firstBlood;
        hacker.machines = machines;
        hacker.writeUps = writeUps;
        hacker.score =
            (firstBlood * 20) +
            (machines * 10) +
            (writeUps * 15) +
            hacker.writeUps_score;
        hackers.sort((a, b) => b.score - a.score);
        hackers.forEach((h, index) => {
            h.rank = index + 1;
            
            // Reassign level based on new rank
            if (h.rank <= 5) {
                h.level = "Elite";
            } else if (h.rank <= 10) {
                h.level = "Advanced";
            } else if (h.rank <= 15) {
                h.level = "Intermediate";
            } else {
                h.level = "Beginner";
            }
        });
        init();
    }
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addHacker,
        updateHackerStats,
        hackers
    };
}

// Run when page loads
document.addEventListener('DOMContentLoaded', init);

// Add typing effect to search placeholder
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    const placeholders = [
        'Search hackers...',
        'Find by name...',
        'Type to filter...'
    ];
    let currentIndex = 0;
    
    setInterval(() => {
        searchInput.placeholder = placeholders[currentIndex];
        currentIndex = (currentIndex + 1) % placeholders.length;
    }, 3000);
}
