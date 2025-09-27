// Simplified and working admin system
import { app, db } from '../firebase-config.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    getDocs, 
    setDoc,
    increment,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

// Admin system for Bruno e Julia wedding

// Global variables
let mesas = [];
let isOnline = true;

// Test Firebase connection
async function testConnection() {
    try {
        const testRef = collection(db, 'mesas');
        const snapshot = await getDocs(testRef);
        return true;
    } catch (error) {
        console.error('Firebase connection failed:', error);
        isOnline = false;
        return false;
    }
}

// Load and listen to mesas
async function setupMesasListener() {
    try {
        const mesasRef = collection(db, 'mesas');
        const q = query(mesasRef, orderBy('chaves', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            mesas = [];
            
            snapshot.forEach((doc) => {
                const mesaData = {
                    id: parseInt(doc.id),
                    ...doc.data(),
                    ultimaAtualizacao: doc.data().ultimaAtualizacao?.toDate() || new Date()
                };
                mesas.push(mesaData);
            });
            
            // Update UI
            updateMesasList();
            updateSelectOptions();
            updateStats();
        });
        
        window.mesasUnsubscribe = unsubscribe;
        
    } catch (error) {
        console.error('❌ Error setting up mesas listener:', error);
    }
}

// Create new mesa
async function createMesa(id, nome) {
    try {
        const mesaData = {
            nome: nome,
            chaves: 0,
            ultimaAtualizacao: serverTimestamp()
        };
        
        await setDoc(doc(db, 'mesas', id.toString()), mesaData);
        showNotification(`Mesa "${nome}" criada com sucesso!`, 'success');
        return true;
        
    } catch (error) {
        console.error('Error creating mesa:', error);
        showNotification('Erro ao criar mesa: ' + error.message, 'error');
        return false;
    }
}

// Add keys to mesa
async function addKeysToMesa(mesaId, quantidade, motivo) {
    try {
        const currentMesa = mesas.find(m => m.id === mesaId);
        if (!currentMesa) {
            throw new Error('Mesa não encontrada');
        }
        
        const newChaves = (currentMesa.chaves || 0) + quantidade;
        
        await setDoc(doc(db, 'mesas', mesaId.toString()), {
            chaves: newChaves,
            ultimaAtualizacao: serverTimestamp()
        }, { merge: true });
        
        // Add to history
        try {
            await addDoc(collection(db, 'historico'), {
                mesaId: mesaId,
                mesaNome: currentMesa.nome || 'Unknown',
                quantidade: quantidade,
                motivo: motivo || 'Adição de chaves',
                dataHora: serverTimestamp()
            });
        } catch (historyError) {
            console.warn('Could not add to history:', historyError.message);
        }
        
        showNotification(`${quantidade} chaves adicionadas!`, 'success');
        return true;
        
    } catch (error) {
        console.error('Error adding keys:', error);
        showNotification('Erro ao adicionar chaves: ' + error.message, 'error');
        return false;
    }
}

// UI Update Functions
function updateMesasList() {
    const container = document.getElementById('mesas-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const sortedMesas = [...mesas].sort((a, b) => b.chaves - a.chaves);
    
    sortedMesas.forEach((mesa, index) => {
        const position = index + 1;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}º`;
        
        const div = document.createElement('div');
        div.className = 'mesa-item';
        div.innerHTML = `
            <div class="mesa-info">
                <div class="mesa-nome">${medal} ${mesa.nome}</div>
                <div class="mesa-chaves">${mesa.chaves} chaves</div>
            </div>
            <div class="mesa-actions">
                <button class="btn btn-sm btn-primary" onclick="quickAddKeys(${mesa.id})">
                    ➕ Chaves
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    

}

function updateSelectOptions() {
    const selects = ['add-mesa-select', 'remove-mesa-select'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione uma mesa</option>';
        
        mesas.forEach(mesa => {
            const option = document.createElement('option');
            option.value = mesa.id;
            option.textContent = `${mesa.nome} (${mesa.chaves} chaves)`;
            select.appendChild(option);
        });
    });
}

function updateStats() {
    const totalChaves = mesas.reduce((sum, mesa) => sum + mesa.chaves, 0);
    const totalMesas = mesas.length;
    const chavesRestantes = Math.max(0, 1000 - totalChaves);
    
    const totalChavesEl = document.getElementById('total-chaves');
    const totalMesasEl = document.getElementById('total-mesas');
    const chavesRestantesEl = document.getElementById('chaves-restantes');
    
    if (totalChavesEl) totalChavesEl.textContent = totalChaves;
    if (totalMesasEl) totalMesasEl.textContent = totalMesas;
    if (chavesRestantesEl) chavesRestantesEl.textContent = chavesRestantes;
}

function showNotification(message, type = 'info') {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1001;
        background: ${type === 'error' ? '#dc3545' : '#28a745'}; 
        color: white; padding: 15px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px; word-wrap: break-word;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => {
        if (document.body.contains(div)) {
            document.body.removeChild(div);
        }
    }, type === 'error' ? 5000 : 3000);
}

// Global functions for buttons
window.quickAddKeys = (mesaId) => {
    document.getElementById('add-mesa-select').value = mesaId;
    document.getElementById('add-quantidade').value = '';
    openModal('add-keys-modal');
};

window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
};

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
    
    // Test connection
    const connected = await testConnection();
    
    if (connected) {
        // Set up real-time listeners
        await setupMesasListener();
    } else {
        showNotification('Firebase não configurado. Configure o Firestore para usar o sistema.', 'error');
    }
    
    // Set up form handlers
    const novaMesaForm = document.getElementById('nova-mesa-form');
    if (novaMesaForm) {
        novaMesaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const idElement = document.getElementById('mesa-id');
            const nomeElement = document.getElementById('mesa-nome');
            
            const idValue = idElement?.value;
            const nomeValue = nomeElement?.value;
            
            const id = parseInt(idValue);
            const nome = nomeValue?.trim();
            
            if (!id || !nome) {
                showNotification('Preencha todos os campos', 'error');
                return;
            }
            
            const existingMesa = mesas.find(m => m.id === id);
            if (existingMesa) {
                showNotification('Mesa com este ID já existe', 'error');
                return;
            }
            
            const success = await createMesa(id, nome);
            
            if (success) {
                novaMesaForm.reset();
            }
        });
    } else {
        console.error('❌ Form "nova-mesa-form" not found!');
    }
    
    const addKeysForm = document.getElementById('add-keys-form');
    if (addKeysForm) {
        addKeysForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mesaId = parseInt(document.getElementById('add-mesa-select').value);
            const quantidade = parseInt(document.getElementById('add-quantidade').value);
            const motivo = document.getElementById('add-motivo').value.trim();
            
            if (!mesaId || !quantidade) {
                showNotification('Selecione mesa e quantidade', 'error');
                return;
            }
            
            const success = await addKeysToMesa(mesaId, quantidade, motivo);
            if (success) {
                closeModal('add-keys-modal');
                addKeysForm.reset();
            }
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
});