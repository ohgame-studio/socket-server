const WebSocket = require('ws');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Updated uuid import
const app = express();
app.use(express.json());
const UserController=require("./controller/users")

const Jwt=require("./service/jwt")
const LoginResonse=require("./response/login")
app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.post('/login', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  let user = await UserController.findUserByUsernamePassword(username, password);

  if (user) {
    const loginResponseInstance =  new LoginResonse(user,await Jwt.createJWTByUser(user));
    res.json(loginResponseInstance);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${server.address().port} ${server.address().address}`);
});


const playerSessions = {};
const wss = new WebSocket.Server({ server });
wss.on('connection', (websocket, request) => {

  websocket.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'login') {//{type,token}
        const token=data.token
        const user=Jwt.getUserByJWT(token)
        if (!user){
          websocket.close() //close when jwt not vaild
        }
        user=UserController.addUUIDByUser(user)
        const playerId = user.uuid;
        if (playerSessions[playerId] && playerSessions[playerId].readyState === WebSocket.OPEN) {
          // Nếu có, đóng kết nối WebSocket hiện tại
          playerSessions[playerId].close();
        }
        playerSessions[playerId] = websocket;

        console.log(`Player ${playerId} logged in.`);
      } else if (data.type === 'logout') {
        const playerId = data.playerId;
        delete playerSessions[playerId];

        console.log(`Player ${playerId} logged out.`);
      } else if (data.type === 'chat') {
        const playerId = data.playerId;
        const messageContent = data.message;

        if (playerSessions[playerId]) {
          Object.values(playerSessions).forEach((playerWebSocket) => {
            if (playerWebSocket !== websocket) {
              playerWebSocket.send(JSON.stringify({ type: 'chat', playerId, message: messageContent }));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error processing message:', error.message);
    }
  });

  websocket.on('close', (code, reason) => {
    const playerId = Object.keys(playerSessions).find((id) => playerSessions[id] === websocket);
    if (playerId) {
      delete playerSessions[playerId];
      console.log(`Player ${playerId} connection closed.`);
    }
  });
});
















// const wss = new WebSocket.Server({ server });

// const clients = [];

// let clientIndex = 1;

// wss.on('connection', function (ws) {
//   const client_uuid = uuidv4(); // Use uuidv4 function
//   const nickname = "AnonymousUser" + clientIndex;
//   clientIndex += 1;

//   clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });

//   console.log('client [%s] connected', client_uuid);

//   ws.on('message', function (message) {
//     if (message.indexOf('/nick') == 0) {
//       const nickname_array = message.split(' ')
//       if (nickname_array.length >= 2) {
//         const old_nickname = nickname;
//         nickname = nickname_array[1];
//         for (let i = 0; i < clients.length; i++) {
//           const clientSocket = clients[i].ws;
//           const nickname_message = "Client " + old_nickname + " changed to " + nickname;
//           clientSocket.send(JSON.stringify({
//             "id": client_uuid,
//             "nickname": nickname,
//             "message": nickname_message
//           }));
//         }
//       }
//     } else {
//       for (let i = 0; i < clients.length; i++) {
//         const clientSocket = clients[i].ws;
//         if (clientSocket.readyState === WebSocket.OPEN) {
//           console.log('client [%s]: %s', clients[i].id, message);
//           clientSocket.send(JSON.stringify({
//             "id": client_uuid,
//             "nickname": nickname,
//             "message": message
//           }));
//         }
//       }
//     }
//   });

//   ws.on('close', function () {
//     for (let i = 0; i < clients.length; i++) {
//       if (clients[i].id == client_uuid) {
//         console.log('client [%s] disconnected', client_uuid);
//         clients.splice(i, 1);
//       }
//     }
//   });
// });
