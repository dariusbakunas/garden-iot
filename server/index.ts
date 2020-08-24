import express from 'express';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import SocketIO from 'socket.io';
import rpio from 'rpio';

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const PUMP_PIN = 11;

rpio.open(PUMP_PIN, rpio.OUTPUT, rpio.LOW);

const server = express();

server.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "http://localhost:8081"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

server.use(express.static(path.join(__dirname, 'client')));
server.use(express.json());
server.use(express.urlencoded());
server.use(compression());

server.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const expressSrv = server.listen(SERVER_PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${SERVER_PORT}`);
});

const io = new SocketIO(expressSrv, { origins: ["*:*"]});

io.on('connection', (socket) => {
  console.log('socket.io client connected');

  const currentStatus = rpio.read(PUMP_PIN);
  socket.emit("pump-status", { status: currentStatus });

  socket.on('turn-pump-on', () => {
    rpio.write(PUMP_PIN, rpio.HIGH);
    socket.emit("pump-status", { status: rpio.read(PUMP_PIN) });
  });

  socket.on('turn-pump-off', () => {
    rpio.write(PUMP_PIN, rpio.LOW);
    socket.emit("pump-status", { status: rpio.read(PUMP_PIN) });
  });

  socket.on('disconnect', () => {
    console.log('socket.io client disconnected');
  });
});
