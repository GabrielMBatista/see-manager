# SSE Manager
## _A Biblioteca Node.js para Server-Sent Events (SSE) Simplificada_

SSE Manager é uma biblioteca Node.js flexível e fácil de usar, projetada para simplificar a implementação de Server-Sent Events (SSE) em aplicações web. 

- Implemente SSE em seu projeto com facilidade
- Gerenciamento eficiente de conexões SSE
- ✨ Facilite a comunicação em tempo real ✨

## Características

- Gerencie conexões SSE de forma eficiente
- Envie mensagens em tempo real para todos ou para usuários específicos
- Fácil de instalar e usar em qualquer aplicação Node.js

## Instalação

Para instalar a biblioteca, clone o repositório e use `yarn` ou `npm link`:

```bash
git clone https://github.com/GabrielMBatista/see-manager.git
cd sse-manager
yarn install # ou npm install
npm link # ou yarn link
```

## Uso

Aqui está um guia rápido sobre como começar a usar a SSE Manager em sua aplicação.

### Importando a Biblioteca

Primeiro, importe a biblioteca no seu projeto:

```javascript
const sseLib = require('sse-manager');
```

### Adicionando um Cliente SSE

Adicione clientes SSE usando a função `addClient`, que aceita um `request` (req), uma `response` (res) e uma função de criação de cliente (createClient):

```javascript
app.get('/events', (req, res) => {
    sseLib.addClient(req, res, (req, res) => {
        // Customize a criação do cliente conforme necessário
        return {
            id: Date.now(),
            userId: req.query.userId,
            res
        };
    });
});
```

### Enviando Eventos para Todos os Clientes

Para enviar uma mensagem para todos os clientes conectados:

```javascript
sseLib.sendToAllClients({ message: 'Mensagem para todos os usuários' });
```

### Enviando Eventos para um Cliente Específico

Para enviar uma mensagem para um usuário específico:

```javascript
sseLib.sendToSpecificClient(
    client => client.userId === 'userIdEspecífico',
    { message: 'Mensagem para um usuário específico' }
);
```

## Contribuições

Contribuições para a biblioteca são sempre bem-vindas! Se você tem uma ideia para melhorá-la, não hesite em contribuir.

## Licença

Esta biblioteca é disponibilizada sob a licença MIT. Veja o arquivo LICENSE no repositório para mais detalhes.
