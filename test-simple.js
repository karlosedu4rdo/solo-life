// Teste simples de conexão Upstash Redis
const { Redis } = require('@upstash/redis')

const redis = new Redis({
  url: 'https://solid-squirrel-28100.upstash.io',
  token: 'AW3EAAIncDIzZjAxZGEyMGFiYzU0OTljOWNiODE5MmQ4YzFlOTZkZXAyMjgxMDA',
})

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Upstash Redis...')
    
    // Teste básico
    await redis.set("solo-life:test", "funcionando!")
    const result = await redis.get("solo-life:test")
    
    console.log('✅ Conexão funcionando!')
    console.log('✅ Resultado:', result)
    console.log('')
    console.log('🎉 SUAS CREDENCIAIS ESTÃO CORRETAS!')
    console.log('✅ Pronto para configurar na Vercel!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testConnection()
