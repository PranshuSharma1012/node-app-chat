const path = require('path')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/custom/js' , express.static(path.join(__dirname, 'public/js')))

app.use('/socket' , express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))

app.get('/', (req, res) => {
//   res.send(__dirname + '/home.ejs');
  res.render('pages/home1.ejs')
});

let onlineUsers = 0

io.on('connection', (socket) => {
    onlineUsers += 1;
    socket.on('disconnect', () => {
        onlineUsers -= 1;
        console.log('user disconnected');
        console.log(`number of users online are : ${onlineUsers}`);
    });

    socket.emit('total_online_users' , {count:onlineUsers})
    
//    console.log(io.sockets.sockets);
   console.log(`number of users online are : ${onlineUsers}`);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});