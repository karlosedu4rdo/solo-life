#!/bin/bash

# Script de Configuração Automática da Persistência Solo Life
# Este script configura automaticamente o Upstash Redis na Vercel

echo "🚀 Configurando Persistência Cross-Device para Solo Life..."
echo ""

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

echo "✅ Vercel CLI verificado"
echo ""

# Verificar se está logado na Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Fazendo login na Vercel..."
    vercel login
fi

echo "✅ Login na Vercel verificado"
echo ""

echo "📋 Configuração das Variáveis de Ambiente:"
echo ""
echo "Para configurar a persistência cross-device, você precisa:"
echo ""
echo "1. 🌐 Acessar: https://upstash.com"
echo "2. 📝 Criar uma conta gratuita"
echo "3. 🗄️ Criar um database Redis"
echo "4. 📋 Copiar as credenciais"
echo ""
echo "Depois execute os comandos abaixo com suas credenciais:"
echo ""
echo "# Substitua pelas suas credenciais do Upstash:"
echo "vercel env add UPSTASH_REDIS_REST_URL"
echo "vercel env add UPSTASH_REDIS_REST_TOKEN"
echo ""
echo "# Exemplo de valores:"
echo "# UPSTASH_REDIS_REST_URL=https://your-database.upstash.io"
echo "# UPSTASH_REDIS_REST_TOKEN=your-token-here"
echo ""
echo "🔄 Após configurar, execute:"
echo "vercel --prod"
echo ""
echo "✅ Pronto! Sua aplicação terá persistência cross-device!"
echo ""
echo "📱 Teste em diferentes dispositivos para verificar a sincronização!"
