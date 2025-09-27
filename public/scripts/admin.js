// Admin system for Bruno e Julia wedding project
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
    query,
    orderBy,
    serverTimestamp 
} from 'firebase/firestore';

class AdminSystem {
    constructor() {
        this.mesas = [];
        this.totalKeys = 1000;
        this.configuracao = { totalChaves: 1000, statusJogo: 'ativo' };
        this.historico = [];
        
        // Bind methods
        this.loadData = this.loadData.bind(this);
        this.renderMesas = this.renderMesas.bind(this);
        this.renderStats = this.renderStats.bind(this);
        this.renderHistory = this.renderHistory.bind(this);
        
        // Initialize
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.updateSelectOptions();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('nova-mesa-form').addEventListener('submit', (e) => this.handleNovaMesa(e));
        document.getElementById('add-keys-form').addEventListener('submit', (e) => this.handleAddKeys(e));
        document.getElementById('remove-keys-form').addEventListener('submit', (e) => this.handleRemoveKeys(e));
        document.getElementById('config-form').addEventListener('submit', (e) => this.handleConfig(e));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    async loadData() {
        try {
            await Promise.all([
                this.loadMesasFromFirestore(),
                this.loadConfigFromFirestore(),
                this.loadHistoryFromFirestore()
            ]);
            
            this.renderMesas();
            this.renderStats();
            this.renderHistory();
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            
            // Fallback to mock data
            this.mesas = await this.getMockMesas();
            this.configuracao = await this.getMockConfig();
            this.historico = await this.getMockHistory();
            
            this.renderMesas();
            this.renderStats();
            this.renderHistory();
            
            this.showError('Conectado ao modo offline. Algumas funcionalidades podem estar limitadas.');
        }
    }

    async loadMesasFromFirestore() {
        const mesasRef = collection(db, 'mesas');
        const querySnapshot = await getDocs(mesasRef);
        
        this.mesas = [];
        querySnapshot.forEach((doc) => {
            this.mesas.push({ 
                id: parseInt(doc.id), 
                ...doc.data() 
            });
        });
    }

    async loadConfigFromFirestore() {
        const configRef = doc(db, 'configuracao', 'jogo');
        const configDoc = await getDoc(configRef);
        
        if (configDoc.exists()) {
            this.configuracao = configDoc.data();
        } else {
            // Create default config
            this.configuracao = { totalChaves: 1000, statusJogo: 'ativo' };
            await setDoc(configRef, this.configuracao);
        }
    }

    async loadHistoryFromFirestore() {
        const historyRef = collection(db, 'historico');
        const q = query(historyRef, orderBy('dataHora', 'desc'));
        const querySnapshot = await getDocs(q);
        
        this.historico = [];
        querySnapshot.forEach((doc) => {
            this.historico.push({ 
                id: doc.id, 
                ...doc.data(),
                dataHora: doc.data().dataHora?.toDate() || new Date()
            });
        });
    }

    // Mock data methods - replace with actual Firebase calls
    async getMockMesas() {
        return [
            { id: 1, nome: 'MESA 01', chaves: 20, ultimaAtualizacao: new Date() },
            { id: 2, nome: 'MESA 02', chaves: 330, ultimaAtualizacao: new Date() },
            { id: 3, nome: 'MESA 03', chaves: 50, ultimaAtualizacao: new Date() },
            { id: 5, nome: 'MESA 05', chaves: 420, ultimaAtualizacao: new Date() },
            { id: 8, nome: 'MESA 08', chaves: 180, ultimaAtualizacao: new Date() },
            { id: 11, nome: 'MESA 11', chaves: 250, ultimaAtualizacao: new Date() },
            { id: 15, nome: 'MESA 15', chaves: 100, ultimaAtualizacao: new Date() },
        ];
    }

    async getMockConfig() {
        return { totalChaves: 1000, statusJogo: 'ativo' };
    }

    async getMockHistory() {
        return [
            { 
                id: 1, 
                mesa: { nome: 'MESA 05' }, 
                quantidade: 50, 
                motivo: 'Completou desafio principal', 
                dataHora: new Date(Date.now() - 60000) 
            },
            { 
                id: 2, 
                mesa: { nome: 'MESA 02' }, 
                quantidade: 30, 
                motivo: 'Participação ativa', 
                dataHora: new Date(Date.now() - 120000) 
            },
            { 
                id: 3, 
                mesa: { nome: 'MESA 11' }, 
                quantidade: -10, 
                motivo: 'Correção de pontuação', 
                dataHora: new Date(Date.now() - 180000) 
            },
        ];
    }

    renderMesas() {
        const container = document.getElementById('mesas-container');
        container.innerHTML = '';

        // Sort by chaves (descending)
        const sortedMesas = [...this.mesas].sort((a, b) => b.chaves - a.chaves);

        sortedMesas.forEach((mesa, index) => {
            const mesaElement = document.createElement('div');
            mesaElement.className = 'mesa-item';
            
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}º`;
            
            mesaElement.innerHTML = `
                <div class="mesa-info">
                    <div class="mesa-nome">${medal} ${mesa.nome}</div>
                    <div class="mesa-chaves">${mesa.chaves} chaves</div>
                </div>
                <div class="mesa-actions">
                    <button class="btn btn-sm btn-primary" onclick="adminSystem.quickAddKeys(${mesa.id})">
                        ➕ Chaves
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="adminSystem.editMesa(${mesa.id})">
                        ✏️ Editar
                    </button>
                </div>
            `;
            
            container.appendChild(mesaElement);
        });
    }

    renderStats() {
        const totalChavesDistribuidas = this.mesas.reduce((sum, mesa) => sum + mesa.chaves, 0);
        const chavesRestantes = this.configuracao.totalChaves - totalChavesDistribuidas;

        document.getElementById('total-chaves').textContent = totalChavesDistribuidas;
        document.getElementById('total-mesas').textContent = this.mesas.length;
        document.getElementById('chaves-restantes').textContent = Math.max(0, chavesRestantes);
    }

    renderHistory() {
        const container = document.getElementById('history-container');
        container.innerHTML = '';

        if (this.historico.length === 0) {
            container.innerHTML = '<p class="loading">Nenhum registro encontrado.</p>';
            return;
        }

        this.historico.forEach(registro => {
            const historyElement = document.createElement('div');
            historyElement.className = `history-item ${registro.quantidade < 0 ? 'negative' : ''}`;
            
            const timeAgo = this.getTimeAgo(registro.dataHora);
            const action = registro.quantidade > 0 ? 'Ganhou' : registro.quantidade < 0 ? 'Perdeu' : 'Redefiniu';
            const amount = Math.abs(registro.quantidade);
            
            historyElement.innerHTML = `
                <div>
                    <strong>${registro.mesa.nome}</strong> ${action} ${amount} chaves
                    ${registro.motivo ? `- ${registro.motivo}` : ''}
                </div>
                <div class="history-meta">${timeAgo}</div>
            `;
            
            container.appendChild(historyElement);
        });
    }

    updateSelectOptions() {
        const selects = ['add-mesa-select', 'remove-mesa-select'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Selecione uma mesa</option>';
            
            this.mesas.forEach(mesa => {
                const option = document.createElement('option');
                option.value = mesa.id;
                option.textContent = `${mesa.nome} (${mesa.chaves} chaves)`;
                select.appendChild(option);
            });
        });
    }

    async handleNovaMesa(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('mesa-id').value);
        const nome = document.getElementById('mesa-nome').value.trim();
        
        // Check if mesa already exists
        if (this.mesas.find(m => m.id === id)) {
            this.showError('Já existe uma mesa com este ID.');
            return;
        }
        
        try {
            const novaMesa = {
                nome,
                chaves: 0,
                ultimaAtualizacao: serverTimestamp()
            };
            
            // Add to Firestore using the ID as document ID
            await setDoc(doc(db, 'mesas', id.toString()), novaMesa);
            
            // Add to local array
            this.mesas.push({ 
                id, 
                nome, 
                chaves: 0, 
                ultimaAtualizacao: new Date() 
            });
            
            document.getElementById('nova-mesa-form').reset();
            this.renderMesas();
            this.renderStats();
            this.updateSelectOptions();
            this.showSuccess('Mesa criada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao criar mesa:', error);
            this.showError('Erro ao criar mesa: ' + error.message);
        }
    }

    async handleAddKeys(e) {
        e.preventDefault();
        
        const mesaId = parseInt(document.getElementById('add-mesa-select').value);
        const quantidade = parseInt(document.getElementById('add-quantidade').value);
        const motivo = document.getElementById('add-motivo').value.trim();
        
        const mesa = this.mesas.find(m => m.id === mesaId);
        if (!mesa) {
            this.showError('Mesa não encontrada.');
            return;
        }
        
        try {
            // Update mesa in Firestore
            const mesaRef = doc(db, 'mesas', mesaId.toString());
            await updateDoc(mesaRef, {
                chaves: increment(quantidade),
                ultimaAtualizacao: serverTimestamp()
            });
            
            // Add to history
            await addDoc(collection(db, 'historico'), {
                mesaId: mesaId,
                mesaNome: mesa.nome,
                quantidade: quantidade,
                motivo: motivo || 'Adição de chaves',
                dataHora: serverTimestamp()
            });
            
            // Update local data
            mesa.chaves += quantidade;
            mesa.ultimaAtualizacao = new Date();
            
            // Add to local history
            this.historico.unshift({
                id: Date.now(),
                mesa: { nome: mesa.nome },
                quantidade,
                motivo,
                dataHora: new Date()
            });
            
            closeModal('add-keys-modal');
            document.getElementById('add-keys-form').reset();
            this.renderMesas();
            this.renderStats();
            this.renderHistory();
            this.updateSelectOptions();
            this.showSuccess(`${quantidade} chaves adicionadas à ${mesa.nome}!`);
            
        } catch (error) {
            console.error('Erro ao adicionar chaves:', error);
            this.showError('Erro ao adicionar chaves: ' + error.message);
        }
    }

    async handleRemoveKeys(e) {
        e.preventDefault();
        
        const mesaId = parseInt(document.getElementById('remove-mesa-select').value);
        const quantidade = parseInt(document.getElementById('remove-quantidade').value);
        const motivo = document.getElementById('remove-motivo').value.trim();
        
        const mesa = this.mesas.find(m => m.id === mesaId);
        if (!mesa || mesa.chaves < quantidade) {
            this.showError('A mesa não possui chaves suficientes.');
            return;
        }
        
        try {
            // Update mesa in Firestore
            const mesaRef = doc(db, 'mesas', mesaId.toString());
            await updateDoc(mesaRef, {
                chaves: increment(-quantidade),
                ultimaAtualizacao: serverTimestamp()
            });
            
            // Add to history
            await addDoc(collection(db, 'historico'), {
                mesaId: mesaId,
                mesaNome: mesa.nome,
                quantidade: -quantidade,
                motivo: motivo,
                dataHora: serverTimestamp()
            });
            
            // Update local data
            mesa.chaves -= quantidade;
            mesa.ultimaAtualizacao = new Date();
            
            // Add to local history
            this.historico.unshift({
                id: Date.now(),
                mesa: { nome: mesa.nome },
                quantidade: -quantidade,
                motivo,
                dataHora: new Date()
            });
            
            closeModal('remove-keys-modal');
            document.getElementById('remove-keys-form').reset();
            this.renderMesas();
            this.renderStats();
            this.renderHistory();
            this.updateSelectOptions();
            this.showSuccess(`${quantidade} chaves removidas de ${mesa.nome}!`);
            
        } catch (error) {
            console.error('Erro ao remover chaves:', error);
            this.showError('Erro ao remover chaves: ' + error.message);
        }
    }

    async handleConfig(e) {
        e.preventDefault();
        
        const totalChaves = parseInt(document.getElementById('total-chaves-config').value);
        const statusJogo = document.getElementById('status-jogo').value;
        
        try {
            const configRef = doc(db, 'configuracao', 'jogo');
            await setDoc(configRef, {
                totalChaves: totalChaves,
                statusJogo: statusJogo,
                ultimaAtualizacao: serverTimestamp()
            });
            
            // Update local config
            this.configuracao = { totalChaves, statusJogo };
            
            closeModal('config-modal');
            this.renderStats();
            this.showSuccess('Configurações atualizadas!');
            
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error);
            this.showError('Erro ao atualizar configurações: ' + error.message);
        }
    }

    quickAddKeys(mesaId) {
        document.getElementById('add-mesa-select').value = mesaId;
        document.getElementById('add-quantidade').value = '10';
        openModal('add-keys-modal');
    }

    editMesa(mesaId) {
        const mesa = this.mesas.find(m => m.id === mesaId);
        if (mesa) {
            const novoTotal = prompt(`Definir novo total de chaves para ${mesa.nome}:`, mesa.chaves);
            if (novoTotal !== null && !isNaN(novoTotal)) {
                const novoTotalNum = parseInt(novoTotal);
                const diferenca = novoTotalNum - mesa.chaves;
                
                mesa.chaves = novoTotalNum;
                mesa.ultimaAtualizacao = new Date();
                
                // Add to history
                this.historico.unshift({
                    id: Date.now(),
                    mesa: { nome: mesa.nome },
                    quantidade: diferenca,
                    motivo: 'Edição manual',
                    dataHora: new Date()
                });
                
                this.renderMesas();
                this.renderStats();
                this.renderHistory();
                this.updateSelectOptions();
                this.showSuccess(`Total de ${mesa.nome} atualizado para ${novoTotalNum} chaves!`);
            }
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Agora mesmo';
        if (minutes < 60) return `${minutes} min atrás`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        
        const days = Math.floor(hours / 24);
        return `${days} dias atrás`;
    }

    showSuccess(message) {
        // Simple success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1001;
            background: #28a745; color: white; padding: 15px 20px;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    showError(message) {
        // Simple error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1001;
            background: #dc3545; color: white; padding: 15px 20px;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
}

// Global modal functions
window.openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
};

window.closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

window.resetGame = () => {
    if (confirm('Tem certeza que deseja resetar o jogo? Esta ação não pode ser desfeita.')) {
        // TODO: Implement reset functionality
        alert('Funcionalidade de reset será implementada com o Firebase Data Connect.');
    }
};

// Initialize admin system
let adminSystem;

document.addEventListener('DOMContentLoaded', () => {
    adminSystem = new AdminSystem();
    
    // Load config values into modal
    document.getElementById('total-chaves-config').value = 1000;
    document.getElementById('status-jogo').value = 'ativo';
});

// Make adminSystem globally available
window.adminSystem = null;
document.addEventListener('DOMContentLoaded', () => {
    window.adminSystem = adminSystem;
});