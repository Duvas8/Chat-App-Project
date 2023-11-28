const express = require('express');
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http') 
const connectDB = require('./config/db')
const corsOptions = require('./config/corsOptions') 
const credentials = require('./middleware/credentials') 
const cookieParser = require('cookie-parser')
const registerRouter = require('./routers/registerRouter');
const authRouter = require('./routers/authRouter');
const refreshRouter = require('./routers/refreshRouter');
const logoutRouter = require('./routers/logoutRouter');
const usersRouter = require('./routers/usersRouter');
const groupsRouter = require('./routers/groupsRouter');
const privetConverstionRouter = require('./routers/privetConverstionRouter');
const authenticateToken = require('./middleware/verifyToken')



const app = express();
const port = 3000;

connectDB()
app.use(cookieParser());
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json());

app.get('/test-cookies', (req, res) => {
  console.log(req.cookies);
  res.send('Check the server console for cookies.');
});


const server = http.createServer(app);
const io = new Server(server, {
  cors:{  
      origin: "http://localhost:5173",
      methods: [ "GET" , "POST"],
      credentials: true,
    }
});

// routers
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);
app.use(authenticateToken);
app.use('/groups', groupsRouter);
app.use('/privetConverstion', privetConverstionRouter);

io.on("connection" , socket => {
  const userId = socket.handshake.query.id
  console.log(`User connected with ID: ${userId}`);
  console.log(`User connected with ID: ${socket.id}`);

  socket.on('leave-current-room', (currentRoom, cd) => {
    
    socket.leave(currentRoom);
    cd(`you have left room ${currentRoom}`);
  });
  
  socket.on('join-room', (room, cd) => {
    socket.join(room);
    cd(`you have joined room ${room}`, room)
  })

  socket.on('send-message', (room, message) => {
    console.log("Received a message for room:", room);
    if (room === '') {
      // Broadcast the message to all connected clients
      socket.broadcast.emit('receive-message', message);
    } else {
      // Send the message to the specified room
      socket.to(room).emit('receive-message', message);
    }
  });  
  socket.on('send-private-message', (room, message) => {
    console.log("Received a message for room:", room);
    if (room === '') {
      // Broadcast the message to all connected clients
      socket.broadcast.emit('receive-private-message', message);
    } else {
      // Send the message to the specified room
      socket.to(room).emit('receive-private-message', message);
    }
  }); 
});


server.listen(
  port,
  () => console.log(`app is listening at http://localhost:${port}`)
)