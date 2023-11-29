
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('message', (message) => {
        console.log(`Received: ${message}`);

        io.emit('message',"Server trả về " + message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
