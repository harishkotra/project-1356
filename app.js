const TOTAL_DAYS = 1356;

const QUOTES = [
    "Life is limited.",
    "Every single day matters.",
    "Who will you be when the number hits zero?",
    "Comfort is a slow death.",
    "1,356 days. Make them count.",
    "The clock is ticking. Are you moving?",
    "Action expresses priorities.",
    "Your potential is wasting away.",
    "Do not go gentle into that good night.",
    "Discipline is freedom."
];

// DOM Elements
const onboardingView = document.getElementById('onboarding-view');
const dashboardView = document.getElementById('dashboard-view');
const completionView = document.getElementById('completion-view');
const startBtn = document.getElementById('start-btn');
const daysRemainingEl = document.getElementById('days-remaining');
const goalsListEl = document.getElementById('goals-list');
const quoteDisplay = document.getElementById('quote-display');
const onboardingInputs = document.querySelectorAll('.setup-input');
const completionStatsEl = document.querySelector('.stats');
const completionMessageEl = document.querySelector('.final-message');
const finalDaysEl = document.getElementById('final-days');
const restartBtn = document.getElementById('restart-btn');

// State Structure
// {
//   startDate: timestamp | null,
//   goals: [ { text: string, completed: boolean }, ... ],
//   daysAchieved: number | null
// }
let state = {
    startDate: null,
    goals: [],
    daysAchieved: null
};

// Initialization
function init() {
    loadState();

    if (state.daysAchieved) {
        showSuccess(state.daysAchieved);
    } else if (state.startDate) {
        updateDashboard();
        // Start live ticker
        setInterval(updateDashboard, 1000 * 60 * 60); // Check every hour is enough for days
    } else {
        showView('onboarding');
    }

    registerServiceWorker();
}

// Logic
function loadState() {
    const stored = localStorage.getItem('project1356_data');
    if (stored) {
        try {
            state = JSON.parse(stored);
        } catch (e) {
            console.error('State corrupted');
        }
    }
}

function saveState() {
    localStorage.setItem('project1356_data', JSON.stringify(state));
}

function startProject() {
    // Validate inputs
    const goals = [];
    let allValid = true;

    onboardingInputs.forEach(input => {
        const val = input.value.trim();
        const placeholderRegex = /^goal\s*\d+$/i;

        if (!val || val.length < 3 || placeholderRegex.test(val) || val.toLowerCase() === 'test') {
            allValid = false;
            input.style.borderBottomColor = 'var(--danger-color)';
            if (placeholderRegex.test(val) || val.toLowerCase() === 'test') {
                alert(`"${val}" is not a real goal. Be specific.`);
            }
        } else {
            input.style.borderBottomColor = 'var(--border-color)';
            goals.push({ text: val, completed: false });
        }
    });

    if (!allValid || goals.length !== 6) {
        alert("You must define all 6 goals to begin.");
        return;
    }

    if (confirm("Once started, you cannot change these goals or restart. Are you ready?")) {
        state.goals = goals;
        state.startDate = Date.now();
        saveState();
        updateDashboard();
    }
}

function resetProject() {
    // Only available from completion/failure screen
    if (confirm("Are you sure you want to start a new 1356 project? Your previous progress will be erased.")) {
        localStorage.removeItem('project1356_data');
        location.reload();
    }
}

function updateDashboard() {
    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const elapsedDays = Math.floor((now - state.startDate) / msPerDay);
    const remaining = TOTAL_DAYS - elapsedDays;

    if (remaining <= 0) {
        showFailure();
        return;
    }

    daysRemainingEl.textContent = remaining;

    if (!quoteDisplay.textContent) {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        quoteDisplay.textContent = randomQuote;
    }

    renderGoals();
    showView('dashboard');
}

function renderGoals() {
    goalsListEl.innerHTML = '';

    state.goals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;

        // Custom Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'goal-checkbox';
        checkbox.checked = goal.completed;

        checkbox.addEventListener('change', () => {
            toggleGoal(index);
        });

        const text = document.createElement('div');
        text.className = 'goal-text';
        text.textContent = goal.text;

        // Clicking row also toggles
        text.addEventListener('click', () => {
            // checkbox.click(); // Avoid double event if checking checkbox directly
            toggleGoal(index);
        });

        goalItem.appendChild(checkbox);
        goalItem.appendChild(text);
        goalsListEl.appendChild(goalItem);
    });
}

function toggleGoal(index) {
    state.goals[index].completed = !state.goals[index].completed;
    saveState();
    renderGoals();
    checkCompletion();
}

function checkCompletion() {
    const allDone = state.goals.every(g => g.completed);
    if (allDone) {
        const now = Date.now();
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysTaken = Math.floor((now - state.startDate) / msPerDay);

        // Just in case it's 0 days
        const daysFinal = daysTaken === 0 ? 1 : daysTaken;

        state.daysAchieved = daysFinal;
        saveState();

        setTimeout(() => {
            showSuccess(daysFinal);
        }, 500); // Small delay for satisfaction
    }
}

function showSuccess(days) {
    completionMessageEl.innerHTML = "Mission Accomplished.";
    finalDaysEl.textContent = days;
    completionStatsEl.style.display = 'block';
    // Show restart button
    if (restartBtn) restartBtn.style.display = 'block';

    // Hide dashboard, show completion
    showView('completion');
}

function showFailure() {
    completionMessageEl.innerHTML = `The Time Is Up.<br><br>Life is limited.<br>Do not waste the next 1,356 days.`;
    completionStatsEl.style.display = 'none'; // Hide stats
    // Show restart button
    if (restartBtn) restartBtn.style.display = 'block';

    showView('completion');
}

function showView(viewName) {
    onboardingView.classList.add('hidden');
    dashboardView.classList.add('hidden');
    completionView.classList.add('hidden');

    if (viewName === 'onboarding') {
        onboardingView.classList.remove('hidden');
    } else if (viewName === 'dashboard') {
        dashboardView.classList.remove('hidden');
    } else if (viewName === 'completion') {
        completionView.classList.remove('hidden');
    }
}

// Event Listeners
startBtn.addEventListener('click', startProject);
if (restartBtn) restartBtn.addEventListener('click', resetProject);

// Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .catch(err => console.log('SW failed', err));
        });
    }
}

// Install Prompt Logic
let deferredPrompt;
const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    if (installContainer) installContainer.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', (e) => {
        // Hide our user interface that shows our A2HS button
        installContainer.classList.add('hidden');
        // Show the prompt
        if (deferredPrompt) {
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        }
    });
}

init();
