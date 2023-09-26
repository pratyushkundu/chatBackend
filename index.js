const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')
require('./db');
app.use(cors());

const PORT = process.env.PORT || 8000;
const Message = require('./model/Message');

const server = http.createServer(app)
const io = new Server(server, 
    {
    cors: {
        origin: 'https://651335765ff2ba083bde4268--quiet-taffy-89d436.netlify.app/',
        methods: ['GET', 'POST']
    }
}
);



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

server.listen(PORT, () => {
    console.log('server running')
})
