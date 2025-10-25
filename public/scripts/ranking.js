// Simple and working ranking system
import { app, db } from '../firebase-config.js';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Ranking system for Bruno e Julia wedding

let mesas = [];

// Test Firebase connection
async function testConnection() {
    try {
        if (!db) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Firebase connection failed:', error);
        return false;
    }
}

// Setup real-time listener for mesas
function setupMesasListener() {
    try {
        console.log('📡 Setting up mesas listener...');
        
        const mesasRef = collection(db, 'mesas');
        const q = query(mesasRef, orderBy('chaves', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            mesas = [];
            
            snapshot.forEach((doc) => {
                const mesaData = {
                    id: parseInt(doc.id),
                    nome: doc.data().nome,
                    chaves: doc.data().chaves || 0,
                    ultimaAtualizacao: doc.data().ultimaAtualizacao?.toDate() || new Date()
                };
                
                mesas.push(mesaData);
            });
            
            updateRankingDisplay();
            
        }, (error) => {
            console.error('❌ Error in mesas listener:', error);
            showError();
        });
        
        // Save unsubscribe function globally
        window.rankingUnsubscribe = unsubscribe;
        
    } catch (error) {
        console.error('❌ Error setting up mesas listener:', error);
    }
}

// Update ranking display
function updateRankingDisplay() {
    renderWinner();
    renderMesasList();
    hideLoading();
}

// Show winner podium (same as original)
function renderWinner() {
    const winnerPodium = document.getElementById('winner-podium');
    const winnerName = document.getElementById('winner-name');
    
    if (mesas.length > 0) {
        const winner = mesas[0];
        winnerName.textContent = winner.nome;
        winnerPodium.style.display = 'flex';
    } else {
        winnerPodium.style.display = 'none';
    }
}

// Render mesas list (same format as original)
function renderMesasList() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    if (mesas.length === 0) {
        rankingList.innerHTML = '<div class="no-data">Nenhuma mesa cadastrada ainda.<br>Use o painel admin para criar mesas.</div>';
        return;
    }

    const totalKeys = 1500; // Default total keys

    const topMesas = mesas.slice(0, 5);

    topMesas.forEach((mesa) => {
        const percentage = totalKeys > 0 ? (mesa.chaves / totalKeys) * 100 : 0;

        const mesaRow = document.createElement('div');
        mesaRow.className = 'mesa-row';

        mesaRow.innerHTML = `
            <div class="progress-fill" style="width: ${percentage}%"></div>
            <div class="mesa-content">
                <span>${mesa.nome}</span>
                <div class="keys">
                    <img src="[https://i.imgur.com/UlRQH5U.png](https://i.imgur.com/UlRQH5U.png)" alt="Ícone Chave" class="key-image-icon" onerror="this.style.display='none';" />
                    <svg class="key-icon fallback-icon" viewBox="0 0 100 100">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="#FFC107" stroke-width="6"/>
                        <rect x="45" y="25" width="40" height="10" fill="#FFC107"/>
                        <rect x="75" y="20" width="5" height="8" fill="#FFC107"/>
                        <rect x="75" y="32" width="5" height="8" fill="#FFC107"/>
                    </svg>
                    <span>${mesa.chaves}</span>
                </div>
            </div>
        `;

        rankingList.appendChild(mesaRow);
    });
}

// Helper functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('ranking-list').style.opacity = '0.5';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('ranking-list').style.opacity = '1';
}







// Initialize ranking system
document.addEventListener('DOMContentLoaded', async () => {
    const connected = await testConnection();
    
    if (connected) {
        setupMesasListener();
    } else {
        showError();
    }
    
});

// Global function for reload button
window.loadRanking = () => {
    location.reload();
};

// Show error function
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('ranking-list').style.opacity = '0.5';
}

