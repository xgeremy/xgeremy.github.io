// Configuración
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = 'YOUR_SHEET_ID'; // Reemplazar con ID de tu Google Sheet
const API_KEY = 'YOUR_API_KEY'; // Reemplazar con tu API Key de Google
const SHEET_RANGE = 'Cliente!A2:F1000';

// Datos en caché
let clientsData = [];
let currentUser = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    loadDataFromSheet();
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
    const progressPercent = Math.min((totalPoints % 150) / 150 * 100, 100);
    document.getElementById('progressBar').style.width = progressPercent + '%';
    document.getElementById('progressMeta').textContent = Math.round(progressPercent) + '%';

    // Progress Info
    const pointsInTier = totalPoints % 150;
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

// Cargar datos de Google Sheets
async function loadDataFromSheet() {
    try {
        // Si no hay configuradas credenciales, usar datos de demo
        if (SHEET_ID === 'YOUR_SHEET_ID' || API_KEY === 'YOUR_API_KEY') {
            console.log('⚠️ Google Sheets no configurado. Usando datos de ejemplo.');
            loadDemoData();
            return;
        }

        const url = `${GOOGLE_SHEETS_API_URL}/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 0) {
            clientsData = data.values.map(row => ({
                nombre: row[0] || '—',
                email: (row[1] || '').toLowerCase(),
                puntos: parseInt(row[2]) || 0,
                tier: row[3] || 'Bronze',
                ultimoTatuaje: row[4] || '—',
                montoCLP: parseInt(row[5]) || 0
            })).filter(user => user.email); // Filtrar usuarios sin email

            console.log(`✅ ${clientsData.length} clientes cargados desde Google Sheets`);
        } else {
            console.log('⚠️ No hay datos en Google Sheets. Usando datos de demo.');
            loadDemoData();
        }
    } catch (error) {
        console.error('Error cargando Google Sheets:', error);
        console.log('Usando datos de demo como fallback');
        loadDemoData();
    }

    // Verificar login después de cargar datos
    checkLogin();
}

// Datos de demo (para desarrollo)
function loadDemoData() {
    clientsData = [
        {
            nombre: 'Geremy Mora',
            email: 'geremy.mora@example.com',
            puntos: 145,
            tier: 'Gold',
            ultimoTatuaje: '15/02/2026',
            montoCLP: 250000
        },
        {
            nombre: 'Carlos Rodriguez',
            email: 'carlos.r@example.com',
            puntos: 98,
            tier: 'Silver',
            ultimoTatuaje: '10/02/2026',
            montoCLP: 180000
        },
        {
            nombre: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            puntos: 62,
            tier: 'Silver',
            ultimoTatuaje: '08/02/2026',
            montoCLP: 120000
        },
        {
            nombre: 'Jorge Silva',
            email: 'jorge.silva@example.com',
            puntos: 35,
            tier: 'Bronze',
            ultimoTatuaje: '05/02/2026',
            montoCLP: 65000
        }
    ];
    console.log('📋 Datos de demo cargados');
}

// Validar email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para sincronizar cambios manuales (puedes usar esta para actualizar puntos)
async function syncWithSheet() {
    console.log('Sincronizando con Google Sheets...');
    await loadDataFromSheet();
    if (currentUser) {
        const updated = clientsData.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (updated) {
            currentUser = updated;
            updateDashboard();
            showSuccessMessage('Datos actualizados correctamente');
        }
    }
}

function showSuccessMessage(msg) {
    const msgEl = document.getElementById('successMessage');
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 3000);
}

// Auto-sincronizar cada 30 segundos
setInterval(syncWithSheet, 30000);
