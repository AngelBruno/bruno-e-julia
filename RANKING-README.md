# 🎩 Sistema de Ranking - Gravata dos Noivos

Sistema desenvolvido para o casamento de **Bruno e Julia** para gerenciar o jogo da "Gravata dos Noivos" com ranking em tempo real das mesas.

## 🎯 Funcionalidades

### Página Pública (ranking.html)
- **Visualização do ranking em tempo real** das mesas
- **Design responsivo** e elegante com tema do casamento
- **Atualização automática** a cada 30 segundos
- **Pódio especial** para a mesa vencedora
- **Barra de progresso** visual para cada mesa

### Painel Administrativo (admin.html)
- **Gerenciamento completo** de mesas e pontuações
- **Adicionar/remover chaves** com motivos
- **Estatísticas gerais** do jogo
- **Histórico de ações** com auditoria
- **Configurações** do jogo (total de chaves, status)
- **Interface intuitiva** para os organizadores

## 🚀 Como executar

### 1. Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Ou usar o Firebase serve
npm run serve
```

### 2. Emuladores Firebase (para testar Data Connect)
```bash
# Iniciar emuladores
npm run emulators:start

# Ou apenas Data Connect
npm run emulators:dataconnect
```

### 3. Deploy para Produção
```bash
# Deploy completo (hosting + dataconnect)
npm run deploy:full

# Ou separadamente
npm run deploy:hosting
npm run deploy:dataconnect
```

## 📁 Estrutura dos Arquivos

```
public/
├── index.html              # Página inicial com navegação
├── ranking.html            # Visualização pública do ranking
├── admin.html              # Painel administrativo
├── styles/
│   ├── ranking.css         # Estilos da página de ranking
│   └── admin.css           # Estilos do painel admin
├── scripts/
│   ├── ranking.js          # Lógica do sistema de ranking
│   └── admin.js            # Lógica do painel administrativo
└── firebase-config.js      # Configuração Firebase

dataconnect/
├── schema/
│   └── ranking-schema.gql  # Schema do banco de dados
└── example/
    ├── ranking-queries.gql # Queries para consultas
    └── ranking-mutations.gql # Mutations para modificações
```

## 🎨 Design e Tema

O sistema usa a fonte **Cinzel** e cores personalizadas que remetem ao tema do casamento:
- **Cor principal**: #083D56 (azul escuro elegante)
- **Cor secundária**: #a7d1e4 (azul claro para progressos)
- **Destaque**: #f8b500 (dourado para vencedores)

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Data Connect (GraphQL)
- **Hosting**: Firebase Hosting
- **Build Tool**: Vite
- **Banco de Dados**: Cloud SQL (via Data Connect)

## 📊 Schema do Banco de Dados

### Tabelas Principais:
- **Mesa**: ID, nome, quantidade de chaves
- **RegistroChave**: Histórico de todas as alterações
- **ConfiguracaoJogo**: Configurações gerais (total de chaves, status)
- **AdminUser**: Usuários com permissão administrativa

### Funcionalidades do GraphQL:
- **Queries**: Listar ranking, buscar mesa específica, obter configurações
- **Mutations**: Adicionar/remover chaves, criar mesas, atualizar configurações
- **Subscriptions**: Atualizações em tempo real (futuro)

## 🔒 Segurança e Autenticação

- **Visualização pública**: Acesso livre ao ranking
- **Administração**: Requer autenticação Firebase
- **Auditoria**: Todas as ações são registradas com timestamp
- **Validação**: Verificações de dados no cliente e servidor

## 📱 Responsividade

O sistema é totalmente responsivo e funciona bem em:
- **Desktop**: Experiência completa com todos os recursos
- **Tablet**: Interface adaptada para toque
- **Mobile**: Design otimizado para visualização em celulares

## 🎮 Como Funciona o Jogo

1. **Mesas participantes** coletam chaves através de desafios
2. **Administradores** atualizam as pontuações em tempo real
3. **Ranking público** mostra a posição atual de cada mesa
4. **Auditoria completa** registra todas as mudanças
5. **Mesa vencedora** é destacada no pódio especial

## 🔮 Próximas Funcionalidades

- [ ] **WebSockets** para atualizações em tempo real
- [ ] **Notificações push** para mudanças importantes
- [ ] **Gráficos** de evolução das pontuações
- [ ] **Sistema de badges** e conquistas
- [ ] **Exportação** de relatórios em PDF
- [ ] **Modo offline** com sincronização posterior

---

**Desenvolvido com ❤️ para o casamento de Bruno e Julia**