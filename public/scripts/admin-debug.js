// Simplified admin system for debugging
import { app, db } from '../firebase-config.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    getDocs, 
    setDoc,
    serverTimestamp 
} from 'firebase/firestore';

console.log('Admin script carregado');
console.log('Firebase app:', app);
console.log('Firestore db:', db);

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('Testando conexão com Firebase...');
        
        // Try to read from Firestore
        const testRef = collection(db, 'test');
        console.log('Conexão com Firestore OK');
        return true;
        
    } catch (error) {
        console.error('Erro na conexão Firebase:', error);
        return false;
    }
}

// Simple mesa creation function
async function criarMesaSimples() {
    try {
        const id = Date.now();
        const nome = `MESA ${id}`;
        
        console.log('Tentando criar mesa:', { id, nome });
        
        const novaMesa = {
            nome: nome,
            chaves: 0,
            ultimaAtualizacao: serverTimestamp()
        };
        
        await setDoc(doc(db, 'mesas', id.toString()), novaMesa);
        console.log('Mesa criada com sucesso!');
        
        return { success: true, id, nome };
        
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        return { success: false, error: error.message };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM carregado, inicializando...');
    
    // Test connection
    const isConnected = await testFirebaseConnection();
    console.log('Firebase conectado:', isConnected);
    
    // Add test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Teste: Criar Mesa';
    testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: red; color: white; border: none; cursor: pointer;';
    testButton.onclick = async () => {
        const result = await criarMesaSimples();
        alert(result.success ? `Mesa criada: ${result.nome}` : `Erro: ${result.error}`);
    };
    document.body.appendChild(testButton);
    
    // Override form submission for nova-mesa-form
    const form = document.getElementById('nova-mesa-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submission interceptado');
            
            const id = parseInt(document.getElementById('mesa-id').value);
            const nome = document.getElementById('mesa-nome').value.trim();
            
            console.log('Dados do formulário:', { id, nome });
            
            if (!id || !nome) {
                alert('Por favor, preencha todos os campos');
                return;
            }
            
            try {
                const novaMesa = {
                    nome: nome,
                    chaves: 0,
                    ultimaAtualizacao: serverTimestamp()
                };
                
                console.log('Salvando mesa no Firestore...');
                await setDoc(doc(db, 'mesas', id.toString()), novaMesa);
                console.log('Mesa salva com sucesso!');
                
                alert(`Mesa ${nome} criada com sucesso!`);
                form.reset();
                
            } catch (error) {
                console.error('Erro detalhado:', error);
                alert(`Erro ao criar mesa: ${error.message}`);
            }
        });
        
        console.log('Event listener adicionado ao form');
    } else {
        console.error('Formulário nova-mesa-form não encontrado');
    }
});