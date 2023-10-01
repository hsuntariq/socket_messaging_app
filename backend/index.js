const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

// my server
const server = http.createServer(app);


// socket.io server

const io = new Server(server, {
    cors: {
        methods: ['POST', "GET"],
        origin: 'http://localhost:5173'
    }
})

io.on("connection", (socket) => {
    console.log(`User connected on host id: ${socket.id}`);
    socket.on('join_room', (data) => {
        socket.join(data);
    })
    socket.on("sent_message", (data) => {
        socket.to(data.room).emit("received_message",data.message);
    })
})


server.listen(3001, () => console.log('server started on port 3001'));
