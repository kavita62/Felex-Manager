# 🚀 Guia de Deploy no Vercel

## Problemas Resolvidos

### ✅ Configurações Implementadas

1. **Arquivo `vercel.json`** - Configuração específica para o Vercel
2. **Arquivo `.nvmrc`** - Especifica versão do Node.js (18.x)
3. **Package.json atualizado** - Nome do projeto e engines especificadas
4. **Vite.config.js otimizado** - Configuração de build melhorada

## 📋 Passos para Deploy

### 1. Conectar ao Vercel
```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Fazer login no Vercel
vercel login
```

### 2. Configurar Variáveis de Ambiente
No dashboard do Vercel, adicione as seguintes variáveis:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Deploy
```bash
# Deploy automático via Git
git push origin main

# Ou deploy manual
vercel --prod
```

## 🔧 Configurações Específicas

### Arquivo `vercel.json`
- Framework: Vite
- Output Directory: `dist`
- Node.js Runtime: 18.x
- Build Command: `npm run build`

### Arquivo `.nvmrc`
- Node.js Version: 18

### Package.json
- Nome do projeto: `felex-manager`
- Engines: Node.js >= 18.0.0

## 🚨 Problemas Comuns

### 1. Submodules Git
Se aparecer erro de submodules, o arquivo `vercel.json` já está configurado para ignorar.

### 2. Dependências Deprecated
Os warnings sobre dependências deprecated são normais e não afetam o funcionamento.

### 3. Build Failures
- Verifique se todas as variáveis de ambiente estão configuradas
- Certifique-se de que o Node.js 18+ está sendo usado

## 📊 Monitoramento

Após o deploy, monitore:
- Build logs no dashboard do Vercel
- Performance da aplicação
- Erros de runtime

## 🔄 Atualizações

Para atualizar o deploy:
```bash
git add .
git commit -m "Update message"
git push origin main
```

O Vercel fará deploy automático após cada push para a branch main. 