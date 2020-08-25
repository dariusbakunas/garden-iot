import express from 'express';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import SocketIO from 'socket.io';
import rpio from 'rpio';
import { spawn } from 'child_process';

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const PUMP_PIN = 11;
const NUM_AVG_POINTS = 4;

const simulation = process.env.SIMULATION === "true";

if (!simulation) {
  rpio.open(PUMP_PIN, rpio.OUTPUT, rpio.LOW);
}

const server = express();

const getMeasurement = (callback: (garden: number, reservoir: number) => void) => {
  if (simulation) {
    callback(7.953, 140.14);
    return;
  }

  const python = spawn('python', ['measure.py']);
  python.stdout.on('data', function (data) {
    const [output1, output2] = data.toString().split(":");
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
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'"]
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

const avg = (max: number) => {
  const values: number[] = [];

  return (value: number) => {
    if (values.length < max) {
      values.push(value);
    } else {
      values.shift();
      values.push(value);
    }

    return values.reduce((a, b) => a + b) / values.length;
  };
};

const expressSrv = server.listen(SERVER_PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${SERVER_PORT}`);
});

const io = new SocketIO(expressSrv, { origins: ["*:*"]});

const gardenAvg = avg(NUM_AVG_POINTS);
const reservoirAvg = avg(NUM_AVG_POINTS);

setInterval(() => {
  getMeasurement((garden: number, reservoir: number) => {
    io.emit("garden-level", gardenAvg(garden));
    io.emit("reservoir-level", reservoirAvg(reservoir));
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
