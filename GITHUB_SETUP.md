# 🚀 Configuração do Git e Push para GitHub

## 📋 Passos para Configurar o Repositório

### 1. Abrir um Novo PowerShell
Abra um **novo** PowerShell como administrador e navegue para o diretório do projeto:

```powershell
cd "E:\2025\social-autoupload\felex-manager-new"
```

### 2. Verificar se o Git está Funcionando
```powershell
git --version
```

Se não funcionar, tente:
```powershell
"C:\Program Files\Git\bin\git.exe" --version
```

### 3. Inicializar o Repositório Git
```powershell
git init
```

### 4. Configurar Usuário Git
```powershell
git config user.name "kavita62"
git config user.email "seu-email@exemplo.com"
```

### 5. Adicionar Todos os Arquivos
```powershell
git add .
```

### 6. Fazer o Primeiro Commit
```powershell
git commit -m "🚀 Initial commit: AutoPost AI - Sistema de Gestão de Redes Sociais"
```

### 7. Adicionar Remote Origin
```powershell
git remote add origin https://github.com/kavita62/Felex-Manager.git
```

### 8. Fazer Push para o GitHub
```powershell
git push -u origin main
```

## 🔧 Comandos Alternativos

Se o Git não estiver no PATH, use o caminho completo:

```powershell
# Inicializar
"C:\Program Files\Git\bin\git.exe" init

# Configurar usuário
"C:\Program Files\Git\bin\git.exe" config user.name "kavita62"
"C:\Program Files\Git\bin\git.exe" config user.email "seu-email@exemplo.com"

# Adicionar arquivos
"C:\Program Files\Git\bin\git.exe" add .

# Commit
"C:\Program Files\Git\bin\git.exe" commit -m "🚀 Initial commit: AutoPost AI"

# Adicionar remote
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/kavita62/Felex-Manager.git

# Push
"C:\Program Files\Git\bin\git.exe" push -u origin main
```

## 🎯 Repositório de Destino

- **URL**: https://github.com/kavita62/Felex-Manager.git
- **Status**: Repositório vazio, pronto para receber o código

## 📦 Arquivos que Serão Enviados

- ✅ `package.json` - Dependências do projeto
- ✅ `README.md` - Documentação atualizada
- ✅ `.gitignore` - Arquivos ignorados
- ✅ `src/` - Código fonte da aplicação
- ✅ `public/` - Arquivos públicos
- ✅ `vite.config.js` - Configuração do Vite
- ✅ `tailwind.config.js` - Configuração do Tailwind
- ✅ `tsconfig.json` - Configuração do TypeScript

## 🚀 Próximos Passos Após o Push

1. **Verificar no GitHub**: Aceda a https://github.com/kavita62/Felex-Manager
2. **Configurar Vercel**: 
   - Aceda a https://vercel.com
   - Importe o repositório
   - Configure as variáveis de ambiente
3. **Deploy Automático**: O Vercel fará deploy automático

## 🔍 Troubleshooting

### Se o Git não for reconhecido:
1. Reinicie o PowerShell
2. Verifique se o Git foi instalado: `winget list Git.Git`
3. Adicione manualmente ao PATH: `$env:PATH += ";C:\Program Files\Git\bin"`

### Se houver erro de autenticação:
1. Configure um token de acesso pessoal no GitHub
2. Use o token como senha quando solicitado

### Se houver conflito de branch:
```powershell
git branch -M main
git push -u origin main
```

## 📞 Suporte

Se encontrar problemas, verifique:
- [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [GitHub Authentication](https://docs.github.com/en/authentication)
- [Vercel Deployment](https://vercel.com/docs/deployments) 