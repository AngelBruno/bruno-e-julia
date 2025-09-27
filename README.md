# Projeto Bruno e Julia - Firebase

Um projeto web com Firebase Hosting e Data Connect configurado com variáveis de ambiente.

## 🚀 Setup Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
O arquivo `.env` já foi criado com suas credenciais. Para projetos futuros:

1. Copie o arquivo `env-template.txt` para `.env`
2. Substitua os valores pelas suas credenciais do Firebase
3. As variáveis devem começar com `VITE_` para funcionar com o Vite

### 3. Desenvolvimento Local
```bash
npm run dev
```
Isso iniciará o servidor de desenvolvimento do Vite em `http://localhost:3000`

## 📦 Build e Deploy

### Build Local
```bash
npm run build
```

### Deploy Apenas Hosting
```bash
npm run deploy
# ou
npm run deploy:hosting
```

### Deploy Completo (requer plano Blaze)
```bash
npm run deploy:full
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build local
- `npm run deploy` - Deploy apenas hosting
- `npm run deploy:hosting` - Deploy apenas hosting
- `npm run deploy:dataconnect` - Deploy apenas Data Connect
- `npm run deploy:full` - Deploy completo
- `npm run emulators:start` - Iniciar emuladores Firebase

## 🛠️ Estrutura do Projeto

```
projeto/
├── public/                 # Arquivos fonte (Vite root)
│   ├── index.html         # Página principal
│   └── firebase-config.js # Configuração Firebase
├── dist/                  # Build de produção (gerado)
├── dataconnect/           # Firebase Data Connect
├── .env                   # Variáveis de ambiente (não commitado)
├── env-template.txt       # Template das variáveis
├── vite.config.js         # Configuração do Vite
├── firebase.json          # Configuração do Firebase
└── package.json           # Dependências e scripts
```

## ⚠️ Firebase Data Connect

O Data Connect requer o plano **Blaze (pay-as-you-go)** do Firebase para funcionar.

### Para ativar o Data Connect:

1. Acesse: https://console.firebase.google.com/project/bruno-e-julia/usage/details
2. Atualize para o plano Blaze
3. Execute: `firebase deploy --only dataconnect`

### Alternativas sem custo:
- Use apenas Firebase Hosting (atual)
- Use Firestore para banco de dados
- Use Firebase Realtime Database

## 🔐 Segurança

- ✅ Credenciais movidas para `.env`
- ✅ `.env` está no `.gitignore`
- ✅ Variáveis prefixadas com `VITE_` para o frontend
- ✅ Template de exemplo criado em `env-template.txt`

## 📱 URLs do Projeto

- **Site:** https://bruno-e-julia-53fc9.web.app
- **Console:** https://console.firebase.google.com/project/bruno-e-julia/overview

## 🆘 Troubleshooting

### Erro "Directory 'public' for Hosting does not exist"
- Execute `npm run build` antes do deploy
- Verifique se `firebase.json` aponta para `"public": "dist"`

### Erro "Data Connect requires Blaze plan"
- Use `npm run deploy:hosting` em vez de `npm run deploy:full`
- Ou atualize para o plano Blaze no console do Firebase