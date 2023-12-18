# SSE Manager
## _Simplificando a Implementação de Server-Sent Events em Node.js_

O SSE Manager é uma biblioteca Node.js poderosa e flexível, projetada para facilitar a implementação de Server-Sent Events (SSE) em aplicações web. Com ela, você pode estabelecer uma comunicação eficiente e em tempo real entre o servidor e os clientes web.

### Principais Características:

- **Gerenciamento Eficiente de Conexões SSE:** Facilita a manipulação de múltiplas conexões SSE, mantendo o desempenho e a estabilidade.
- **Envio de Mensagens em Tempo Real:** Envie atualizações ou notificações instantâneas para todos os usuários ou para usuários específicos.
- **Fácil Integração:** Integrável com qualquer aplicação Node.js, sem necessidade de grandes alterações no código existente.

## Instalação

Para começar a usar o SSE Manager, siga os passos abaixo:

1. **Clonar o Repositório:**
```bash
git clone https://github.com/GabrielMBatista/see-manager.git
cd sse-manager
```
2. **Instalar Dependências:**
```bash
yarn install # ou npm install
```
3. **Linkar o Pacote:**
```bash
npm link # ou yarn link
```

## Configuração e Uso

### Configurando o Backend

1. **Importe a Biblioteca:**
```javascript
const SSEServer = require('sse-manager');
```

2. **Defina as Rotas SSE:**
```javascript
// src/routes/sseRoutes.js
const express = require('express');
const router = express.Router();
const SSEServer = require('sse-manager');

// Rota para conexão SSE
router.get('/events', (req, res) => {
    const createClient = (req, res) => {
    // Customize a criação do cliente conforme necessário
        return { id: Date.now(), userId: req.query.userId, ..., res };
    };

    SSEServer.addClient(req, res, createClient);
});

// Rota para enviar mensagem a todos os clientes
router.post('/send-to-all', (req, res) => {
    const data = req.body; // ou alguma mensagem padrão
    SSEServer.sendToAllClients(data);
    res.status(200).send("Mensagem enviada para todos os clientes.");
});

// Rota para enviar mensagem a um cliente específico
router.post('/send-to-user', (req, res) => {
    const { userId, message } = req.body; 
    SSEServer.sendToSpecificClient(userId, message);
    res.status(200).send(\`Mensagem enviada para o usuário: ${userId}\`);
});

module.exports = router;
```

3. **Adicione as Rotas ao seu Aplicativo:**
```javascript
app.use('/sse', sseRoutes);

// Se for rodar localmente adicione tambem
const cors = require('cors');
app.use(cors());
```

### Integrando com Frontend (React)

1. **Conectar com o Servidor SSE:**
```javascript
import { SSEClient } from 'sse-manager';
const userIds = user.id;
const baseUrl = 'http://localhost:3333';

useEffect(() => {
    const sseClient = new SSEClient(baseUrl, userIds);
    sseClient.onMessage((data) => {
        //aplique a logica necessaria
        console.log('Mensagem recebida:', data);
    });
    sseClient.onError((error) => {
        //aplique a logica necessaria
        console.error('Erro na conexão SSE:', error);
    });
    sseClient.connect();

    return () => {
        sseClient.disconnect();
    };
}, [user.id]);
```

### Uso Direto dos envio de msg em Funções

```javascript
const SSEServer = require('sse-manager');
...
try {
codigo atual...
    const userId = 'user1'; // ou array const userId = ['user1','user2','user3'];
    const dataToSendUser = 'msg to a single user';
    const dataToSendAll = 'msg to all clients';
    SSEServer.sendToAllClients(dataToSendAll);
    SSEServer.sendToSpecificClient(userId, dataToSendUser);
} catch (error) {
    console.error('Erro', error.message);
}
```

## Contribuições

Encorajamos contribuições para melhorar ainda mais o SSE Manager. Se você tem ideias ou sugestões, por favor, participe do desenvolvimento!

## Licença

O SSE Manager está sob a licença MIT. Consulte o arquivo LICENSE no repositório para mais detalhes.
