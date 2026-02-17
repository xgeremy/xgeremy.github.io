// Configuración
const DATA_URL = 'data.json';

// Datos en caché
let clientsData = [];
let currentUser = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromJSON();
});

// Login
function loginUser() {
    const email = document.getElementById('emailInput').value.trim().toLowerCase();
    const errorMsg = document.getElementById('errorMessage');

    if (!email || !isValidEmail(email)) {
        errorMsg.textContent = 'Por favor ingresa un email válido';
        return;
    }

    errorMsg.textContent = '';

    // Guardar email en localStorage
    localStorage.setItem('xgeremy_user_email', email);

    // Buscar usuario en datos
    const user = clientsData.find(u => u.email.toLowerCase() === email);

    if (!user) {
        // Usuario nuevo - crear registro
        currentUser = {
            nombre: email.split('@')[0],
            email: email,
            puntos: 0,
            tier: 'Bronze',
            ultimoTatuaje: '—',
            montoCLP: 0
        };
    } else {
        currentUser = user;
    }

    showDashboard();
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    updateDashboard();
}

// Actualizar dashboard con datos del usuario
function updateDashboard() {
    if (!currentUser) return;

    // Header
    document.getElementById('userName').textContent = currentUser.nombre;
    document.getElementById('userEmail').textContent = currentUser.email;

    // Stats
    const totalPoints = parseInt(currentUser.puntos) || 0;
    const creditValue = totalPoints * 1000; // 1 punto = 1000 CLP
    const tier = getTier(totalPoints);

    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('creditValue').textContent = `$${creditValue.toLocaleString('es-CL')} CLP`;
    document.getElementById('tierName').textContent = tier;
    updateTierBadge(tier);

    // Progress Bar
    const pointsInTier = totalPoints % 150;
    const progressPercent = Math.min((pointsInTier / 150) * 100, 100);
    document.getElementById('progressBar').style.width = progressPercent + '%';
    document.getElementById('progressMeta').textContent = Math.round(progressPercent) + '%';

    // Progress Info
    document.getElementById('currentTierProgress').textContent = `${pointsInTier} / 150 puntos`;

    // CLP Needed
    const clpNeeded = (150 - pointsInTier) * 1000;
    document.getElementById('clpRemaining').textContent = `$${clpNeeded.toLocaleString('es-CL')}`;

    // Leaderboard
    updateLeaderboard();
}

// Get tier según puntos
function getTier(points) {
    points = parseInt(points) || 0;
    if (points >= 101) return 'Gold';
    if (points >= 51) return 'Silver';
    return 'Bronze';
}

// Update tier badge
function updateTierBadge(tier) {
    const badge = document.getElementById('tierBadge');
    badge.textContent = tier;
    badge.className = 'tier-badge tier-' + tier.toLowerCase();
}

// Leaderboard
function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    // Ordenar clientes por puntos
    const sorted = [...clientsData]
        .sort((a, b) => parseInt(b.puntos || 0) - parseInt(a.puntos || 0))
        .slice(0, 3);

    if (sorted.length === 0) {
        leaderboard.innerHTML = '<div class="empty-state"><p>Sin datos en el leaderboard</p></div>';
        return;
    }

    leaderboard.innerHTML = sorted.map((cliente, index) => {
        const rankClass = index === 0 ? 'rank1' : index === 1 ? 'rank2' : 'rank3';
        const symbol = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        
        // Anonimizar nombre (solo inicial y apellido)
        const nameParts = cliente.nombre.trim().split(' ');
        const displayName = nameParts.length > 1 
            ? nameParts[0].charAt(0) + '. ' + nameParts[nameParts.length - 1]
            : nameParts[0];

        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">${symbol}</div>
                <div class="leaderboard-name">${displayName}</div>
                <div class="leaderboard-points">${cliente.puntos} pts</div>
            </div>
        `;
    }).join('');
}

// Cargar datos desde JSON
async function loadDataFromJSON() {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            clientsData = data.map(row => ({
                nombre: row.nombre || '—',
                email: (row.email || '').toLowerCase(),
                puntos: parseInt(row.puntos) || 0,
                tier: row.tier || 'Bronze',
                ultimoTatuaje: row.ultimoTatuaje || '—',
                montoCLP: parseInt(row.montoCLP) || 0
            })).filter(user => user.email);

            console.log(`✅ ${clientsData.length} clientes cargados desde data.json`);
        } else {
            console.log('⚠️ No hay datos en data.json');
            clientsData = [];
        }
    } catch (error) {
        console.error('Error cargando data.json:', error);
        clientsData = [];
    }

    // Verificar login después de cargar datos
    checkLogin();
}

// Check si hay sesión
function checkLogin() {
    const savedEmail = localStorage.getItem('xgeremy_user_email');
    if (savedEmail && clientsData.length > 0) {
        document.getElementById('emailInput').value = savedEmail;
        loginUser();
    }
}

// Logout
function logout() {
    localStorage.removeItem('xgeremy_user_email');
    currentUser = null;
    document.getElementById('loginSection').style.display = 'grid';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('emailInput').value = '';
    document.getElementById('errorMessage').textContent = '';
}

// Validar email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showSuccessMessage(msg) {
    const msgEl = document.getElementById('successMessage');
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 3000);
}
