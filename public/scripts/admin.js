// Simplified and working admin system
import { app, db } from '../firebase-config.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    getDocs, 
    getDoc,
    setDoc,
    increment,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    deleteDoc
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

async function setupHistoricoListener() {
    try {
        const historicoRef = collection(db, 'historico', 'bV3oggvLWnbtvuxWtwws', 'registros');
        const q = query(historicoRef, orderBy('dataHora', 'desc'));

        onSnapshot(q, (snapshot) => {
            const historico = [];
            snapshot.forEach((doc) => {
                historico.push(doc.data());
            });
            updateHistoricoList(historico); // Chama a função para atualizar a interface
        });
    } catch (error) {
        console.error('❌ Error setting up historico listener:', error);
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
async function addKeysToMesa(mesaId, quantidade) {
    try {
        const currentMesa = mesas.find(m => m.id === mesaId);
        if (!currentMesa) {
            throw new Error('Mesa não encontrada');
        }
        
        const mesaRefStr = mesaId > 9 ? mesaId.toString() : '0' + mesaId.toString();
        const mesaRef = doc(db, 'mesas', mesaRefStr);
        await updateDoc(mesaRef, {
            chaves: increment(quantidade),
            ultimaAtualizacao: serverTimestamp()
        });
        
        // Add to history
        await addHistory({
            mesaId: mesaRefStr,
            mesaNome: currentMesa.nome,
            quantidade: quantidade,
            motivo: 'Adição de chaves',
            dataHora: serverTimestamp()
        });
        
        showNotification(`${quantidade} chaves adicionadas!`, 'success');
        closeModal('add-keys-modal');
        return true;
        
    } catch (error) {
        console.error('Error adding keys:', error);
        showNotification('Erro ao adicionar chaves: ' + error.message, 'error');
        return false;
    }
}

// Remove keys to mesa
async function removeKeysToMesa(mesaId, quantidade, motivo) {
    try {
        const currentMesa = mesas.find(m => m.id === mesaId);
        if (!currentMesa) {
            throw new Error('Mesa não encontrada');
        }

        const newQuantity = currentMesa.chaves - quantidade;
        if (newQuantity < 0) {
            throw new Error('Quantidade insuficiente de chaves na mesa');
        }
        
        const mesaRefStr = mesaId > 9 ? mesaId.toString() : '0' + mesaId.toString();
        const mesaRef = doc(db, 'mesas', mesaRefStr);
        await updateDoc(mesaRef, {
            chaves: newQuantity,
            ultimaAtualizacao: serverTimestamp()
        });
        
        // Add to history
        await addHistory({
            mesaId: mesaRefStr,
            mesaNome: currentMesa.nome || 'Unknown',
            quantidade: -quantidade, // Salva como negativo para remoção
            motivo: motivo || 'Remoção de chaves',
            dataHora: serverTimestamp()
        });
        
        showNotification(`${quantidade} chaves removidas!`, 'success');
        closeModal('remove-keys-modal');
        return true;
        
    } catch (error) {
        console.error('Error removing keys:', error);
        showNotification('Erro ao remover chaves: ' + error.message, 'error');
        return false;
    }
}

async function addHistory(data) {
    try {
        const historicoDocRef = doc(db, 'historico', 'bV3oggvLWnbtvuxWtwws');
        const historicoDoc = await getDoc(historicoDocRef);

        if (!historicoDoc.exists()) {
            await setDoc(historicoDocRef, {});
        }

        console.log('Adding to history:', data);
        await addDoc(collection(historicoDocRef, 'registros'), data);
        console.log('Successfully added to history.');
    } catch (historyError) {
        console.warn('Could not add to history:', historyError.message);
    }
}

// Salvar número sorteado manualmente
async function salvarNumeroSorteado(numero) {
    try {
        const sorteioRef = doc(db, 'sorteio', 'resultado');
        await setDoc(sorteioRef, { numero: numero, timestamp: serverTimestamp() });
        showNotification(`Número ${numero} salvo com sucesso!`, 'success');
        closeModal('manual-sorteio-modal');
    } catch (error) {
        console.error('Erro ao salvar número sorteado:', error);
        showNotification('Erro ao salvar número: ' + error.message, 'error');
    }
}

// UI Update Functions
function updateMesasList() {
    const container = document.getElementById('mesas-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const sortedMesas = [...mesas].sort((a, b) => a.id - b.id);
    
    sortedMesas.forEach((mesa, index) => {
        const position = index + 1;
        
        const div = document.createElement('div');
        div.className = 'mesa-item';
        div.innerHTML = `
            <div class="mesa-info">
                <div class="mesa-nome">${mesa.nome}</div>
                <div class="mesa-chaves">${mesa.chaves} chaves</div>
            </div>
            <div class="mesa-actions">
                <button class="btn btn-sm btn-success" onclick="quickAddKeys(${mesa.id})">
                    ➕ Chaves
                </button>
                <button class="btn btn-sm btn-danger" onclick="quickRemoveKeys(${mesa.id})">
                    ➖ Chaves
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateHistoricoList(historico) {
    const tbody = document.getElementById('historico-tbody');
    if (!tbody) return;

    tbody.innerHTML = ''; // Limpa a tabela antes de recarregar

    historico.forEach(item => {
        const dataHora = item.dataHora?.toDate ? item.dataHora.toDate().toLocaleString('pt-BR') : 'Carregando...';
        const quantidadeClass = item.quantidade > 0 ? 'positivo' : 'negativo';
        const quantidadeTexto = item.quantidade > 0 ? `+${item.quantidade}` : item.quantidade;

        const row = `
            <tr>
                <td>${item.mesaNome} (ID: ${item.mesaId})</td>
                <td class="${quantidadeClass}">${quantidadeTexto}</td>
                <td>${item.motivo}</td>
                <td>${dataHora}</td>
            </tr>
        `;
        tbody.innerHTML += row;
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
    const chavesRestantes = Math.max(0, 1500 - totalChaves);
    
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

// Função para sortear número 
window.sortearNumero = () => {
    const max = mesas.reduce((sum, mesa) => sum + mesa.chaves, 0);
    const numero = Math.floor(Math.random() * max) + 1;
    document.getElementById('resultado-sorteio').textContent = numero;
};

// Global functions for buttons
window.quickAddKeys = (mesaId) => {
    document.getElementById('add-mesa-select').value = mesaId;
    document.getElementById('add-quantidade').value = '';
    openModal('add-keys-modal');
};

window.quickRemoveKeys = (mesaId) => {
    document.getElementById('remove-mesa-select').value = mesaId;
    document.getElementById('remove-quantidade').value = '';
    openModal('remove-keys-modal');
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
        await setupHistoricoListener(); // ADIÇÃO: Chama a função para carregar o histórico
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
            
            if (!mesaId || !quantidade) {
                showNotification('Selecione mesa e quantidade', 'error');
                return;
            }
            
            // Passa o motivo para a função
            const success = await addKeysToMesa(mesaId, quantidade); 
            if (success) {
                addKeysForm.reset();
            }
        });
    }

    const removeKeysForm = document.getElementById('remove-keys-form');
    if (removeKeysForm) {
        removeKeysForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mesaId = parseInt(document.getElementById('remove-mesa-select').value);
            const quantidade = parseInt(document.getElementById('remove-quantidade').value);
            const motivo = document.getElementById('remove-motivo').value.trim();
            
            if (!mesaId || !quantidade) {
                showNotification('Selecione mesa e quantidade', 'error');
                return;
            }
            
            const success = await removeKeysToMesa(mesaId, quantidade, motivo);
            if (success) {
                removeKeysForm.reset();
            }
        });
    }

    const manualSorteioForm = document.getElementById('manual-sorteio-form');
    if (manualSorteioForm) {
        manualSorteioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const numero = parseInt(document.getElementById('numero-sorteado').value);
            if (!numero) {
                showNotification('Digite um número válido', 'error');
                return;
            }
            await salvarNumeroSorteado(numero);
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    const deleteBtn = document.getElementById('delete-sorteio-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja apagar o número sorteado?')) {
                await deleteSorteio();
            }
        });
    }
});

async function deleteSorteio() {
    try {
        const sorteioRef = doc(db, 'sorteio', 'resultado');
        await deleteDoc(sorteioRef);
        showNotification('Número sorteado apagado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao apagar número sorteado:', error);
        showNotification('Erro ao apagar número sorteado: ' + error.message, 'error');
    }
}