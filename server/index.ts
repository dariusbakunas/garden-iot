import express from 'express';
import helmet from 'helmet';
import path from "path";

const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = express();
server.use(helmet());

server.use(express.static(path.join(__dirname, 'client')));
server.use(express.json());
server.use(express.urlencoded());
server.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
server.listen(SERVER_PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${SERVER_PORT}`);
});