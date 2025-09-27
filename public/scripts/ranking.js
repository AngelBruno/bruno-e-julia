// Ranking system for Bruno e Julia wedding project
import { app } from '../firebase-config.js';

// Data Connect client will be imported when generated
// import { dataConnect } from '../src/dataconnect-generated/index.esm.js';

class RankingSystem {
    constructor() {
        this.mesas = [];
        this.totalKeys = 1000;
        this.isLoading = false;
        
        // URLs das imagens
        this.urlLogoJB = "https://i.imgur.com/H0lljWw.png";
        this.urlFechadura = "https://i.imgur.com/roNFBG5.png";
        this.urlChave = "https://i.imgur.com/UlRQH5U.png";
        
        // Bind methods
        this.loadRanking = this.loadRanking.bind(this);
        this.renderRanking = this.renderRanking.bind(this);
        
        // Auto-refresh every 30 seconds
        this.autoRefreshInterval = setInterval(() => {
            this.loadRanking();
        }, 30000);
    }

    async loadRanking() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // For now, use mock data until Data Connect is fully set up
            const mockData = await this.getMockData();
            
            // TODO: Replace with actual Firebase Data Connect query
            // const { data } = await listMesasRanking();
            // this.mesas = data.mesas;
            
            this.mesas = mockData.sort((a, b) => b.chaves - a.chaves);
            this.renderRanking();
            this.hideLoading();
            
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    // Temporary mock data - replace with actual Firebase Data Connect calls
    async getMockData() {
        return [
            { id: 1, nome: 'MESA 05', chaves: 420 },
            { id: 2, nome: 'MESA 02', chaves: 330 },
            { id: 3, nome: 'MESA 11', chaves: 250 },
            { id: 4, nome: 'MESA 08', chaves: 180 },
            { id: 5, nome: 'MESA 15', chaves: 100 },
            { id: 6, nome: 'MESA 03', chaves: 50 },
            { id: 7, nome: 'MESA 01', chaves: 20 },
        ];
    }

    renderRanking() {
        this.renderWinner();
        this.renderMesasList();
    }

    renderWinner() {
        const winnerPodium = document.getElementById('winner-podium');
        const winnerName = document.getElementById('winner-name');
        
        if (this.mesas.length > 0) {
            const winner = this.mesas[0];
            winnerName.textContent = winner.nome;
            winnerPodium.style.display = 'flex';
        } else {
            winnerPodium.style.display = 'none';
        }
    }

    renderMesasList() {
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';

        this.mesas.forEach((mesa) => {
            const percentage = this.totalKeys > 0 ? (mesa.chaves / this.totalKeys) * 100 : 0;
            
            const mesaRow = document.createElement('div');
            mesaRow.className = 'mesa-row';
            
            mesaRow.innerHTML = `
                <div class="progress-fill" style="width: ${percentage}%"></div>
                <div class="mesa-content">
                    <span>${mesa.nome}</span>
                    <div class="keys">
                        <img src="${this.urlChave}" alt="Ícone Chave" class="key-image-icon" onerror="this.style.display='none';" />
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

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('ranking-list').style.opacity = '0.5';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('ranking-list').style.opacity = '1';
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('ranking-list').style.opacity = '0.5';
    }

    // Cleanup method
    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}

// Initialize ranking system when DOM is loaded
let rankingSystem;

document.addEventListener('DOMContentLoaded', () => {
    rankingSystem = new RankingSystem();
    rankingSystem.loadRanking();
});

// Global function for button onclick
window.loadRanking = () => {
    if (rankingSystem) {
        rankingSystem.loadRanking();
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (rankingSystem) {
        rankingSystem.destroy();
    }
});