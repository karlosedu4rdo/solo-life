const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupPersistence() {
  console.log('🚀 Configuração Automática da Persistência Solo Life');
  console.log('');
  
  try {
    // Verificar se Vercel CLI está instalado
    console.log('🔍 Verificando Vercel CLI...');
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI encontrado');
    } catch (error) {
      console.log('❌ Vercel CLI não encontrado. Instalando...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI instalado');
    }
    
    console.log('');
    console.log('📋 INSTRUÇÕES PARA CONFIGURAÇÃO:');
    console.log('');
    console.log('1. 🌐 Acesse: https://upstash.com');
    console.log('2. 📝 Crie uma conta gratuita');
    console.log('3. 🗄️ Crie um database Redis');
    console.log('4. 📋 Copie as credenciais');
    console.log('');
    
    const url = await question('🔗 Cole aqui a UPSTASH_REDIS_REST_URL: ');
    const token = await question('🔑 Cole aqui o UPSTASH_REDIS_REST_TOKEN: ');
    
    if (!url || !token) {
      console.log('❌ Credenciais não fornecidas. Execute novamente.');
      process.exit(1);
    }
    
    console.log('');
    console.log('🔧 Configurando variáveis na Vercel...');
    
    try {
      // Configurar variáveis de ambiente
      execSync(`vercel env add UPSTASH_REDIS_REST_URL "${url}"`, { stdio: 'inherit' });
      execSync(`vercel env add UPSTASH_REDIS_REST_TOKEN "${token}"`, { stdio: 'inherit' });
      
      console.log('✅ Variáveis configuradas com sucesso!');
      console.log('');
      console.log('🚀 Fazendo deploy...');
      
      execSync('vercel --prod', { stdio: 'inherit' });
      
      console.log('');
      console.log('🎉 CONFIGURAÇÃO CONCLUÍDA!');
      console.log('');
      console.log('✅ Sua aplicação agora tem persistência cross-device!');
      console.log('📱 Teste em diferentes dispositivos para verificar a sincronização!');
      
    } catch (error) {
      console.log('❌ Erro na configuração:', error.message);
      console.log('');
      console.log('🔧 CONFIGURAÇÃO MANUAL:');
      console.log('1. Acesse: https://vercel.com/dashboard');
      console.log('2. Selecione seu projeto solo-life');
      console.log('3. Vá em Settings → Environment Variables');
      console.log('4. Adicione:');
      console.log(`   UPSTASH_REDIS_REST_URL = ${url}`);
      console.log(`   UPSTASH_REDIS_REST_TOKEN = ${token}`);
      console.log('5. Faça deploy manual');
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  } finally {
    rl.close();
  }
}

setupPersistence();
