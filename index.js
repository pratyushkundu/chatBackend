const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')
require('./db');
app.use(cors());
const Message = require('./model/Message');

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});



io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('join_room',async (data) => {
        socket.join(data);
        console.log(`User with ID:${socket.id} joined room with ID ${data}`);
      
        // Fetch previous messages from MongoDB and emit to the client
        try {
            const messages = await Message.find({ room: data });
            socket.emit('load_previous_messages', messages);
          } catch (err) {
            console.error(err);
          }
      });

      socket.on('send_message', async (data) => {
        const newMessage = new Message(data);
        try {
          await newMessage.save();
        } catch (err) {
          console.error(err);
        }
        socket.to(data.room).emit('receive_message', data);
      });
    
    socket.on('disconnect', () => {
        console.log('disconnected user', socket.id)
    })
})

server.listen(8000, () => {
    console.log('server running')
})