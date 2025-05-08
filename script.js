// DOM Elements
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginContent = document.getElementById('loginContent');
const signupContent = document.getElementById('signupContent');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginSubmit = document.getElementById('loginSubmit');
const signupSubmit = document.getElementById('signupSubmit');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const authSection = document.getElementById('authSection');
const welcomeScreen = document.getElementById('welcomeScreen');
const predictionScreen = document.getElementById('predictionScreen');
const predictBtn = document.getElementById('predictBtn');
const resultsSection = document.getElementById('resultsSection');

// Slider elements
const academicLevel = document.getElementById('academicLevel');
const academicLevelValue = document.getElementById('academicLevelValue');
const aiUsageTime = document.getElementById('aiUsageTime');
const aiUsageTimeValue = document.getElementById('aiUsageTimeValue');
const aiHomeworkPercent = document.getElementById('aiHomeworkPercent');
const aiHomeworkPercentValue = document.getElementById('aiHomeworkPercentValue');
const aiDependencyLevel = document.getElementById('aiDependencyLevel');
const aiDependencyLevelValue = document.getElementById('aiDependencyLevelValue');
const courseDifficulty = document.getElementById('courseDifficulty');
const courseDifficultyValue = document.getElementById('courseDifficultyValue');
const studyHoursNoAI = document.getElementById('studyHoursNoAI');
const studyHoursNoAIValue = document.getElementById('studyHoursNoAIValue');
const aiUnderstanding = document.getElementById('aiUnderstanding');
const aiUnderstandingValue = document.getElementById('aiUnderstandingValue');

// Update slider values
academicLevel.addEventListener('input', () => academicLevelValue.textContent = academicLevel.value);
aiUsageTime.addEventListener('input', () => aiUsageTimeValue.textContent = aiUsageTime.value);
aiHomeworkPercent.addEventListener('input', () => aiHomeworkPercentValue.textContent = aiHomeworkPercent.value + '%');
aiDependencyLevel.addEventListener('input', () => aiDependencyLevelValue.textContent = aiDependencyLevel.value);
courseDifficulty.addEventListener('input', () => courseDifficultyValue.textContent = courseDifficulty.value);
studyHoursNoAI.addEventListener('input', () => studyHoursNoAIValue.textContent = studyHoursNoAI.value);
aiUnderstanding.addEventListener('input', () => aiUnderstandingValue.textContent = aiUnderstanding.value);

// Auth Modal Functions
function openModal(tab = 'login') {
    authModal.classList.add('active');
    if (tab === 'login') {
        activateTab(loginTab, loginContent);
    } else {
        activateTab(signupTab, signupContent);
    }
}

function closeModalFn() {
    authModal.classList.remove('active');
}

function activateTab(tabElement, contentElement) {
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activate the clicked tab
    tabElement.classList.add('active');
    contentElement.classList.add('active');
}

// Event Listeners
loginBtn.addEventListener('click', () => openModal('login'));
signupBtn.addEventListener('click', () => openModal('signup'));
getStartedBtn.addEventListener('click', () => openModal('signup'));
closeModal.addEventListener('click', closeModalFn);
loginTab.addEventListener('click', () => activateTab(loginTab, loginContent));
signupTab.addEventListener('click', () => activateTab(signupTab, signupContent));
switchToSignup.addEventListener('click', () => activateTab(signupTab, signupContent));
switchToLogin.addEventListener('click', () => activateTab(loginTab, loginContent));

// Outside click to close modal
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModalFn();
    }
});

// Auth submissions
loginSubmit.addEventListener('click', handleLogin);
signupSubmit.addEventListener('click', handleSignup);

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }

    // Simple localStorage auth simulation
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.email === email && u.password === password);

    if (currentUser) {
        userProfile.style.display = 'flex';
        authSection.style.display = 'none';
        userName.textContent = currentUser.name;
        userAvatar.textContent = currentUser.name.charAt(0);
        welcomeScreen.classList.remove('active');
        predictionScreen.classList.add('active');
        closeModalFn();
    } else {
        alert('Invalid credentials');
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        alert('User already exists');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    userProfile.style.display = 'flex';
    authSection.style.display = 'none';
    userName.textContent = name;
    userAvatar.textContent = name.charAt(0);
    welcomeScreen.classList.remove('active');
    predictionScreen.classList.add('active');
    closeModalFn();
}

// TensorFlow.js Model
let model;
async function createModel() {
    model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [6], units: 32, activation: 'relu' }),
            tf.layers.dense({ units: 16, activation: 'relu' }),
            tf.layers.dense({ units: 1, activation: 'linear' })
        ]
    });

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Generate synthetic training data
    const xs = tf.randomNormal([1000, 6]);
    const ys = tf.randomNormal([1000, 1]);

    await model.fit(xs, ys, { epochs: 10, batchSize: 32 });
}

// Initialize model
createModel();

// Chart instances
let gpaChart, factorChart;
const chartConfig = {
    gpaProjection: {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'GPA Projection',
                data: [3.0, 3.2, 3.3, 3.4],
                borderColor: '#6366f1',
                tension: 0.4
            }]
        }
    },
    factorAnalysis: {
        type: 'bar',
        data: {
            labels: ['AI Hours', 'Dependency', 'Course Difficulty', 'Study Hours', 'AI Understanding', 'Field'],
            datasets: [{
                label: 'Impact Score',
                data: [0.8, 0.6, 0.4, 0.7, 0.3, 0.5],
                backgroundColor: '#818cf8'
            }]
        }
    }
};

// Prediction handler
predictBtn.addEventListener('click', async () => {
    const inputFeatures = [
        parseFloat(academicLevel.value),
        parseFloat(aiUsageTime.value),
        parseFloat(aiDependencyLevel.value),
        parseFloat(courseDifficulty.value),
        parseFloat(studyHoursNoAI.value),
        parseFloat(aiUnderstanding.value)
    ];

    // Make prediction
    const prediction = model.predict(tf.tensor2d([inputFeatures]));
    const predictedGPA = prediction.dataSync()[0].toFixed(1);

    // Update UI
    document.getElementById('predictedGPA').textContent = predictedGPA;
    document.getElementById('dependencyProgress').style.width = 
        `${Math.min(100, (aiDependencyLevel.value / 10) * 100)}%`;
    resultsSection.style.display = 'block';

    // Initialize charts
    if (gpaChart) gpaChart.destroy();
    if (factorChart) factorChart.destroy();

    gpaChart = new Chart(document.getElementById('gpaProjectionChart'), 
        chartConfig.gpaProjection);

    factorChart = new Chart(document.getElementById('factorAnalysisChart'), 
        chartConfig.factorAnalysis);

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
});

// Initialize application
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.dispatchEvent(new Event('input'));
});