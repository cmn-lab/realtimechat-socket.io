const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = []
let currentUser = '';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat', (req,res)=>{
  let userID = req.query.userid;

  users.map((user,id)=>{
    if(user.id == userID){
      currentUser = user.username;
      res.sendFile(__dirname + '/chat.html');
    }else{
      console.log('user not found');
    }
  })
})


io.on('connection', async (socket) => {
  console.log('a user connected');
  socket.emit("online", {status: "online"});
  
  socket.on('disconnect',()=>{
      console.log('a user disconnected');
      socket.emit("offline", {status: "offline"})
  });

  //user is created - occurs during login
  socket.on('userCreated', (payload, loginAcknowledgement) => {
    const { username } = payload;
    let generatedId = randomIdGenerator();
    users.push({ id: generatedId, username: username});

    let destination = '/chat';
    loginAcknowledgement({ userID: generatedId, username: username, destination: destination });
  })

  // receive message
  socket.on('chat message',(payload)=>{    
    const { sender, message } = payload;
    let chatMessage = `${sender}: ${message}`;

    // send message to everyone (broadcast)
    io.emit('chat message', chatMessage);

    // send message to everyone (broadcast) except the sender
    //socket.broadcast.emit('chat message', chatMessage);
  });


});

function randomIdGenerator(){
  const randomNumber = Math.random();
  return randomNumber;
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});