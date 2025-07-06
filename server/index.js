const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  } });

app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/auth'));
const tab4uRoutes = require('./routes/Tab4U');
app.use('/api/tab4u', tab4uRoutes);

// mongoDB connection
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error(err));


// socket connection
io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('selected-song', (songData) => {
    io.emit('song-selected', songData);
  });

  socket.on('quit-session', () => {
    io.emit('session-ended');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));