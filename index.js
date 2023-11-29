const WebSocket = require('ws');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Updated uuid import
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${server.address().port} ${server.address().address}`);
});

const wss = new WebSocket.Server({ server });

const clients = [];

let clientIndex = 1;

wss.on('connection', function (ws) {
  const client_uuid = uuidv4(); // Use uuidv4 function
  const nickname = "AnonymousUser" + clientIndex;
  clientIndex += 1;

  clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });

  console.log('client [%s] connected', client_uuid);

  ws.on('message', function (message) {
    if (message.indexOf('/nick') == 0) {
      const nickname_array = message.split(' ')
      if (nickname_array.length >= 2) {
        const old_nickname = nickname;
        nickname = nickname_array[1];
        for (let i = 0; i < clients.length; i++) {
          const clientSocket = clients[i].ws;
          const nickname_message = "Client " + old_nickname + " changed to " + nickname;
          clientSocket.send(JSON.stringify({
            "id": client_uuid,
            "nickname": nickname,
            "message": nickname_message
          }));
        }
      }
    } else {
      for (let i = 0; i < clients.length; i++) {
        const clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
          console.log('client [%s]: %s', clients[i].id, message);
          clientSocket.send(JSON.stringify({
            "id": client_uuid,
            "nickname": nickname,
            "message": message
          }));
        }
      }
    }
  });

  ws.on('close', function () {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id == client_uuid) {
        console.log('client [%s] disconnected', client_uuid);
        clients.splice(i, 1);
      }
    }
  });
});
