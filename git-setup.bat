@echo off
echo 🚀 Configurando Git e fazendo push para o repositório...

REM Adicionar Git ao PATH
set PATH=%PATH%;C:\Program Files\Git\bin

REM Inicializar repositório Git
echo 📁 Inicializando repositório Git...
git init

REM Configurar usuário Git
echo 👤 Configurando usuário Git...
git config user.name "kavita62"
git config user.email "kavita62@github.com"

REM Adicionar todos os arquivos
echo 📦 Adicionando arquivos ao repositório...
git add .

REM Fazer primeiro commit
echo 💾 Fazendo primeiro commit...
git commit -m "🚀 Initial commit: AutoPost AI - Sistema de Gestão de Redes Sociais"

REM Adicionar remote origin
echo 🔗 Adicionando remote origin...
git remote add origin https://github.com/kavita62/Felex-Manager.git

REM Fazer push para o repositório
echo 📤 Fazendo push para o GitHub...
git push -u origin main

echo ✅ Push realizado com sucesso!
echo 🌐 Repositório disponível em: https://github.com/kavita62/Felex-Manager.git
pause 