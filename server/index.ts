import express from 'express';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import SocketIO from 'socket.io';
import rpio from 'rpio';
import { spawn } from 'child_process';

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const PUMP_PIN = 11;

rpio.open(PUMP_PIN, rpio.OUTPUT, rpio.LOW);

const server = express();

const getDistance = (callback: (distance1: number, distance2: number) => void) => {
  const python = spawn('python', ['measure.py']);
  python.stdout.on('data', function (data) {
    const [output1, output2] = data.split(":");
    const distance1 = Number.parseFloat(output1);
    const distance2 = Number.parseFloat(output2);
    callback(Math.round(distance1 * 100) / 100, Math.round(distance2 * 100) / 100);
  });
};

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

setInterval(() => {
  getDistance((distance1: number, distance2: number) => {
    io.emit("distance1", distance1);
    io.emit("distance2", distance2);
  });
}, 5000);

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
