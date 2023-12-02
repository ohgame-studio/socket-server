const WebSocket = require('ws');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Updated uuid import
const app = express();
app.use(express.json());
const UserController = require("./controller/users")
const ServerController = require('./controller/server')
const SocketLogic = require("./logic/socket")
const Jwt = require("./service/jwt")
const LoginResonse = require("./response/login")
const ServerListResponse=require("./response/server_list.js")
const logger = require("./service/log")

// Init server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${server.address().port} ${server.address().address}`);
  ServerController.addServer("Test", "localhost", 3000, 0)
});
 
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
    const loginResponseInstance = new LoginResonse(user, await Jwt.createJWTByUser(user));
    res.json(loginResponseInstance);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});
app.post('/serverlist', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  let user = await Jwt.getUserByJWT(token)
  if (user) {
    let server_list =await ServerController.getServerListByUserType(user.usertype)
    const serverlist = new ServerListResponse(server_list);
    res.json(serverlist);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});



const playerSessions = {};
const wss = new WebSocket.Server({ server });
wss.on('connection', (websocket, request) => {

  websocket.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'login') {//{type,token}
        const token = data.token
        let user = await Jwt.getUserByJWT(token)
        if (!user && user === undefined) {
          websocket.close();
          return
        }
        user = await UserController.addUUIDByUser(user)
        const playerId = user.uuid;
        if (playerSessions[playerId] && playerSessions[playerId].readyState === WebSocket.OPEN) {
          SocketLogic.disconnectByUUID(playerId)
        }
        SocketLogic.connectToServer(playerId, websocket)
      }
    } catch (error) {
      console.error('Error processing message:', error.message);
    }
  });

  websocket.on('close', (code, reason) => {
    SocketLogic.disconnect(websocket)
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
