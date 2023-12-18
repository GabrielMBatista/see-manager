SSE Manager
SSE Manager é uma biblioteca Node.js flexível e fácil de usar, projetada para simplificar a implementação de Server-Sent Events (SSE) em aplicações web. Esta biblioteca permite o gerenciamento eficiente de conexões SSE, facilitando o envio de mensagens em tempo real para clientes conectados, seja para todos os usuários ou para usuários específicos.

Instalação
Para instalar a biblioteca, execute o seguinte comando no seu projeto Node.js:

bash
Copy code
npm install sse-manager
Uso
Aqui está um guia rápido sobre como começar a usar a SSE Manager em sua aplicação.

Importando a Biblioteca
Primeiro, importe a biblioteca no seu projeto:

javascript
Copy code
const sseLib = require('sse-manager');
Adicionando um Cliente SSE
Adicione clientes SSE usando a função addClient, que aceita um request (req), uma response (res) e uma função de criação de cliente (createClient):

javascript
Copy code
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
Enviando Eventos para Todos os Clientes
Para enviar uma mensagem para todos os clientes conectados:

javascript
Copy code
sseLib.sendToAllClients({ message: 'Mensagem para todos os usuários' });
Enviando Eventos para um Cliente Específico
Para enviar uma mensagem para um usuário específico:

javascript
Copy code
sseLib.sendToSpecificClient(
    client => client.userId === 'userIdEspecífico',
    { message: 'Mensagem para um usuário específico' }
);

Contribuições
Contribuições para a biblioteca são sempre bem-vindas! Se você tem uma ideia para melhorá-la.

Licença
Esta biblioteca é disponibilizada sob a licença MIT. Veja o arquivo LICENSE no repositório para mais detalhes.