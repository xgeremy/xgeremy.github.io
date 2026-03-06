// Configuracion
const DATA_URL = 'data.json';
const SUPABASE_URL = 'https://lmopbyirrhhpluuussjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NZ8C6r-jsGeT77QUbMYzsA_rY_Dd1nj';
let supabaseClient = null;

// Datos en cache
let clientsData = [];
let currentUser = null;
const MEDALS = ['🥇', '🥈', '🥉'];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setInterval(() => refreshDataSilently(), 15000);
});

async function initializeData() {
    await loadClientData();
}

async function refreshDataSilently() {
    const hadUser = !!currentUser;
    const currentEmail = hadUser ? currentUser.email : null;
    await loadClientData();
    if (hadUser && currentEmail) {
        const updated = clientsData.find(u => u.email.toLowerCase() === currentEmail.toLowerCase());
        if (updated) {
            currentUser = updated;
            updateDashboard();
        }
    }
}

function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
}

// Login
function loginUser() {
    const email = document.getElementById('emailInput').value.trim().toLowerCase();
    const errorMsg = document.getElementById('errorMessage');

    if (!email || !isValidEmail(email)) {
        errorMsg.textContent = 'Por favor ingresa un email valido';
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
            tier: 'Novato',
            ultimoTatuaje: '-',
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
    if(window.updateTattooCard) window.updateTattooCard(currentUser, totalPoints, tier);

    // Progress Bar
    const nextTierInfo = getNextTierInfo(totalPoints);
    const pointsForNextTier = nextTierInfo.goal;
    const pointsEarned = nextTierInfo.current;
    const pointsToGoal = pointsForNextTier - pointsEarned;
    const progressPercent = (pointsEarned / pointsForNextTier) * 100;
    
    document.getElementById('progressBar').style.width = Math.min(progressPercent, 100) + '%';
    document.getElementById('progressMeta').textContent = Math.round(progressPercent) + '%';

    // Progress Info
    document.getElementById('currentTierProgress').textContent = `${pointsEarned} / ${pointsForNextTier} puntos`;
    document.getElementById('nextMilestone').textContent = `Próximo tier: ${nextTierInfo.tier}`;

    // CLP Needed (opcional, cambiar si lo deseas)
    document.getElementById('clpRemaining').textContent = `${pointsToGoal} puntos para ${nextTierInfo.tier}`;

    // Leaderboard
    updateLeaderboard();
}

// Get tier segun puntos
function getTier(points) {
    points = parseInt(points) || 0;
    if (points >= 101) return 'Oro';
    if (points >= 51) return 'Plata';
    if (points >= 25) return 'Bronce';
    return 'Novato';
}

// Get next tier info
function getNextTierInfo(points) {
    points = parseInt(points) || 0;
    if (points < 25) {
        return { tier: 'Bronce', goal: 25, current: points };
    } else if (points < 51) {
        return { tier: 'Plata', goal: 51, current: points };
    } else if (points < 101) {
        return { tier: 'Oro', goal: 101, current: points };
    } else {
        return { tier: 'Maestro', goal: 150, current: points };
    }
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
    if (!leaderboard) return;
    
    // Ordenar clientes por puntos
    const sorted = [...clientsData]
        .sort((a, b) => parseInt(b.puntos || 0) - parseInt(a.puntos || 0))
        .slice(0, 3);

    if (sorted.length === 0) {
        leaderboard.innerHTML = '<div class="empty-state"><p>Sin datos en el leaderboard</p></div>';
        return;
    }

    try {
      leaderboard.innerHTML = sorted.map((cliente, index) => {
        const rankClass = index === 0 ? 'rank1' : index === 1 ? 'rank2' : 'rank3';
        const symbol = MEDALS[index] || (index + 1);
        
        // Anonimizar nombre (solo inicial y apellido)
        const baseName = String(cliente?.nombre || '').trim() || 'Cliente';
        const nameParts = baseName.split(' ');
        const displayName = nameParts.length > 1 
            ? nameParts[0].charAt(0) + '. ' + nameParts[nameParts.length - 1]
            : nameParts[0];

        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">${symbol}</div>
                <div class="leaderboard-name">${displayName}</div>
                <div class="leaderboard-points">${parseInt(cliente.puntos || 0)} pts</div>
            </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Error renderizando leaderboard:', e);
      leaderboard.innerHTML = '<div class="empty-state"><p>No se pudo cargar el leaderboard</p></div>';
    }
}

// Cargar datos desde JSON
async function loadDataFromJSON() {
    const urls = [DATA_URL, '/puntos/data.json'];
    try {
        let data = null;
        for (const u of urls) {
            try {
                const response = await fetch(u, { cache: 'no-store' });
                if (!response.ok) continue;
                const parsed = await response.json();
                if (Array.isArray(parsed)) { data = parsed; break; }
            } catch {}
        }

        if (Array.isArray(data) && data.length > 0) {
            clientsData = data.map(row => ({
                nombre: row.nombre || '-',
                email: (row.email || '').toLowerCase(),
                puntos: parseInt(row.puntos) || 0,
                tier: row.tier || 'Bronze',
                ultimoTatuaje: row.ultimoTatuaje || '-',
                montoCLP: parseInt(row.montoCLP) || 0
            })).filter(user => user.email);

            console.log(`[OK] ${clientsData.length} clientes cargados desde JSON`);
        } else {
            console.log('[WARN] No hay datos en JSON');
            clientsData = [];
        }
    } catch (error) {
        console.error('Error cargando JSON:', error);
        clientsData = [];
    }

    // Verificar login despues de cargar datos
    checkLogin();
}

async function loadDataFromSupabase() {
    const db = getSupabaseClient();
    if (!db) return false;

    try {
        const { data, error } = await db
            .from('clientes')
            .select('nombre,email,puntos,tier,ultimoTatuaje,montoCLP')
            .order('puntos', { ascending: false });

        if (error) throw error;
        if (!Array.isArray(data)) return false;

        clientsData = data.map(row => ({
            nombre: row.nombre || '-',
            email: (row.email || '').toLowerCase(),
            puntos: parseInt(row.puntos) || 0,
            tier: row.tier || 'Novato',
            ultimoTatuaje: row.ultimoTatuaje || '-',
            montoCLP: parseInt(row.montoCLP) || 0
        })).filter(user => user.email);

        console.log(`[OK] ${clientsData.length} clientes cargados desde Supabase`);
        return true;
    } catch (error) {
        console.error('Error cargando clientes desde Supabase:', error);
        return false;
    }
}

async function loadClientData() {
    const loadedFromSupabase = await loadDataFromSupabase();
    if (!loadedFromSupabase) {
        await loadDataFromJSON();
        return;
    }
    checkLogin();
}

// Check si hay sesión
function checkLogin() {
    if (currentUser) return;
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


