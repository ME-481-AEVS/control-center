import { WebSocketServer } from 'ws';
// import https from 'https';
import app from './index.js';
// import serverConfig from './config.js';

// const server = https.createServer(serverConfig);

// const socket = new WebSocketServer({ server: server });
const socket = new WebSocketServer({ port: 8080 });

function sendTo(connection, msg) {
  connection.send(JSON.stringify(msg));
}

// socket.on('request', app);

socket.on('connection', (ws) => {
  console.log('Web socket connected');

  ws.on('error', console.error);

  ws.on('message', (msg) => {
    console.log('Message from client:');
    console.log(msg);
  });

  ws.on('close', () => {
    console.log('Web socket disconnected');
  });

  // ping for telemetry every second
  setInterval(() => {
    sendTo(ws, { type: 'heartbeat' });
  }, 1000);

  ws.send(JSON.stringify({ msg: 'connected' }));
});

// server.listen(5000);
// console.log('Server started on port 5000');
