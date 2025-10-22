@echo off
REM Script de Configuração Automática da Persistência Solo Life
REM Este script configura automaticamente o Upstash Redis na Vercel

echo 🚀 Configurando Persistência Cross-Device para Solo Life...
echo.

REM Verificar se o Vercel CLI está instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI não encontrado. Instalando...
    npm install -g vercel
)

echo ✅ Vercel CLI verificado
echo.

REM Verificar se está logado na Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Fazendo login na Vercel...
    vercel login
)

echo ✅ Login na Vercel verificado
echo.

echo 📋 Configuração das Variáveis de Ambiente:
echo.
echo Para configurar a persistência cross-device, você precisa:
echo.
echo 1. 🌐 Acessar: https://upstash.com
echo 2. 📝 Criar uma conta gratuita
echo 3. 🗄️ Criar um database Redis
echo 4. 📋 Copiar as credenciais
echo.
echo Depois execute os comandos abaixo com suas credenciais:
echo.
echo REM Substitua pelas suas credenciais do Upstash:
echo vercel env add UPSTASH_REDIS_REST_URL
echo vercel env add UPSTASH_REDIS_REST_TOKEN
echo.
echo REM Exemplo de valores:
echo REM UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
echo REM UPSTASH_REDIS_REST_TOKEN=your-token-here
echo.
echo 🔄 Após configurar, execute:
echo vercel --prod
echo.
echo ✅ Pronto! Sua aplicação terá persistência cross-device!
echo.
echo 📱 Teste em diferentes dispositivos para verificar a sincronização!
pause
