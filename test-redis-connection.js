import { Redis } from '@upstash/redis'

// Teste de conexão com suas credenciais
const redis = new Redis({
  url: 'https://solid-squirrel-28100.upstash.io',
  token: 'AW3EAAIncDIzZjAxZGEyMGFiYzU0OTljOWNiODE5MmQ4YzFlOTZkZXAyMjgxMDA',
})

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Upstash Redis...')
    
    // Teste de escrita
    await redis.set("solo-life:test", "conexão funcionando!")
    console.log('✅ Escrita realizada com sucesso')
    
    // Teste de leitura
    const result = await redis.get("solo-life:test")
    console.log('✅ Leitura realizada com sucesso:', result)
    
    // Teste de dados de usuário
    const testUser = {
      id: 'test-user-123',
      email: 'test@solo-life.com',
      name: 'Usuário Teste',
      createdAt: new Date().toISOString()
    }
    
    await redis.set("solo-life:user:test-user-123", JSON.stringify(testUser))
    console.log('✅ Dados de usuário salvos com sucesso')
    
    const savedUser = await redis.get("solo-life:user:test-user-123")
    console.log('✅ Dados de usuário recuperados:', JSON.parse(savedUser))
    
    console.log('')
    console.log('🎉 CONEXÃO FUNCIONANDO PERFEITAMENTE!')
    console.log('✅ Suas credenciais estão corretas')
    console.log('✅ Redis está respondendo')
    console.log('✅ Pronto para usar na aplicação Solo Life!')
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    console.log('')
    console.log('🔧 Verifique:')
    console.log('1. Se as credenciais estão corretas')
    console.log('2. Se o database está ativo no Upstash')
    console.log('3. Se há conexão com a internet')
  }
}

testConnection()
