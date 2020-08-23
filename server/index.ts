import express from 'express';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import SocketIO from 'socket.io';

import camera from 'node-webcam';

const Webcam = camera.create({
  callbackReturn: "base64",
  saveShots: true,
  width: 1280,
  height: 720,
  delay: 0,
  frames: 60,
});

function captureFrame(sockets: SocketIO.Server) {
  Webcam.capture( "picture", function( err: Error, data: string ) {
    if( err ) {
      throw err;
    }

    sockets.emit('frame', { data });
    setTimeout( captureFrame.bind(null, sockets), 25 );
  });
}

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = express();

server.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self", 'http://localhost:3000'],
      connectSrc: ["'self'", 'http://localhost:3000'],
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
  console.log('socket.io client connected')
});

captureFrame(io);