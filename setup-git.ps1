# Script para configurar Git e inicializar repositório
Write-Host "🚀 Configurando Git e inicializando repositório..." -ForegroundColor Green

# Adicionar Git ao PATH temporariamente
$env:PATH += ";C:\Program Files\Git\bin"

# Verificar se Git está disponível
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado. Tentando instalar..." -ForegroundColor Red
    winget install --id Git.Git -e --source winget
    Start-Sleep -Seconds 10
    $env:PATH += ";C:\Program Files\Git\bin"
}

# Inicializar repositório Git
Write-Host "📁 Inicializando repositório Git..." -ForegroundColor Yellow
git init

# Configurar usuário Git (substitua pelos seus dados)
Write-Host "👤 Configurando usuário Git..." -ForegroundColor Yellow
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"

# Adicionar todos os arquivos
Write-Host "📦 Adicionando arquivos ao repositório..." -ForegroundColor Yellow
git add .

# Fazer primeiro commit
Write-Host "💾 Fazendo primeiro commit..." -ForegroundColor Yellow
git commit -m "🚀 Initial commit: AutoPost AI - Sistema de Gestão de Redes Sociais"

Write-Host "✅ Repositório Git configurado com sucesso!" -ForegroundColor Green
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub" -ForegroundColor White
Write-Host "2. Execute: git remote add origin https://github.com/seu-usuario/autopost-ai.git" -ForegroundColor White
Write-Host "3. Execute: git push -u origin main" -ForegroundColor White
Write-Host "4. Configure o deploy no Vercel" -ForegroundColor White 