# 🚀 Solo Life - Vercel KV Database Setup

## 📊 Configuração do Banco de Dados Vercel KV

O Solo Life agora usa **Vercel KV** (Redis) como banco de dados principal, oferecendo:

- ✅ **Persistência real** na Vercel
- ✅ **Performance excepcional** (Redis)
- ✅ **Escalabilidade automática**
- ✅ **Backup automático**
- ✅ **TTL configurável**

## 🔧 Configuração na Vercel

### 1. Adicionar Vercel KV ao Projeto

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto `solo-life`
3. Vá para **Storage** → **Create Database**
4. Escolha **KV** (Redis)
5. Configure:
   - **Name**: `solo-life-kv`
   - **Region**: `iad1` (ou mais próxima)
   - **Plan**: `Hobby` (gratuito)

### 2. Variáveis de Ambiente Automáticas

A Vercel automaticamente adiciona estas variáveis:

```env
KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your-write-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
```

### 3. Deploy Automático

Após adicionar o KV, faça o deploy:

```bash
git push origin main
```

A Vercel detectará automaticamente as variáveis e conectará ao banco.

## 🎯 Funcionalidades do KV Database

### **Operações Básicas**
- **Write**: Salvar dados com TTL opcional
- **Read**: Carregar dados com fallback
- **Delete**: Remover dados específicos
- **Exists**: Verificar existência

### **Operações Avançadas**
- **Increment/Decrement**: Contadores (XP, níveis)
- **TTL Management**: Expiração automática
- **Backup/Restore**: Backup completo
- **Stats**: Estatísticas de uso

### **Entidades Suportadas**
- 👤 **Player**: Dados do jogador
- 🎯 **Habits**: Hábitos e rotinas
- 💰 **Finance**: Transações e investimentos
- 🏆 **Achievements**: Conquistas
- 📚 **Culture**: Itens culturais
- ⚠️ **Vices**: Controle de vícios
- 💪 **Workout**: Sessões de treino
- 🔔 **Notifications**: Notificações

## 📊 Estrutura dos Dados

### **Chaves do KV**
```
solo-life:player
solo-life:habits
solo-life:transactions
solo-life:financial-goals
solo-life:investments
solo-life:achievements
solo-life:notifications
solo-life:culture-items
solo-life:vices
solo-life:workout-sessions
solo-life:workout-logs
solo-life:backup:timestamp
```

### **TTL Padrão**
- **Dados principais**: 30 dias
- **Sessões**: 24 horas
- **Cache**: 1 hora
- **Backups**: 90 dias

## 🔄 APIs Disponíveis

### **Dados**
- `GET /api/data/[entity]` - Carregar dados
- `POST /api/data/[entity]` - Salvar dados

### **Backup**
- `POST /api/database/backup` - Criar backup
- `PUT /api/database/backup` - Restaurar backup

### **Estatísticas**
- `GET /api/database/stats` - Estatísticas do banco

## 🚀 Vantagens do Vercel KV

### **Performance**
- **Latência**: < 1ms
- **Throughput**: 10,000+ ops/segundo
- **Memória**: Redis em memória

### **Confiabilidade**
- **Durabilidade**: Persistência garantida
- **Backup**: Automático diário
- **Replicação**: Multi-região

### **Escalabilidade**
- **Auto-scaling**: Cresce automaticamente
- **Global**: Edge locations
- **Limits**: 256MB (Hobby), 1GB (Pro)

## 🔧 Configuração Avançada

### **TTL Personalizado**
```typescript
// Salvar com TTL específico
await KVOperations.saveSession('daily-progress', data, 86400) // 24h
```

### **Contadores**
```typescript
// Incrementar XP
const newXP = await KVOperations.incrementCounter('player-xp', 50)

// Decrementar vida
const newHealth = await KVOperations.decrementCounter('player-health', 10)
```

### **Backup Programático**
```typescript
// Criar backup
const backupKey = await KVOperations.createBackup()

// Restaurar backup
await KVOperations.restoreFromBackup(backupKey)
```

## 📈 Monitoramento

### **Estatísticas Disponíveis**
- Total de chaves
- Tamanho usado
- TTL restante
- Operações por segundo

### **Logs**
- Todas as operações são logadas
- Erros são capturados
- Performance é monitorada

## 🆘 Troubleshooting

### **Problemas Comuns**

1. **Erro de Conexão**
   - Verifique as variáveis de ambiente
   - Confirme que o KV está ativo

2. **Timeout**
   - Aumente o `maxDuration` nas funções
   - Otimize queries complexas

3. **Limite de Memória**
   - Upgrade para plano Pro
   - Implemente limpeza automática

### **Debug**
```typescript
// Verificar conexão
const stats = await KVOperations.getStats()
console.log('KV Stats:', stats)

// Listar todas as chaves
const keys = await kvDb.listKeys()
console.log('All Keys:', keys)
```

## 🎯 Próximos Passos

1. **Adicionar KV** na Vercel Dashboard
2. **Deploy** o projeto
3. **Testar** as funcionalidades
4. **Monitorar** performance
5. **Otimizar** conforme necessário

---

**Solo Life** agora tem persistência profissional com Vercel KV! 🚀✨
