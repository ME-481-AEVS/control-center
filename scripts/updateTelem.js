let socketConnected;

const socket = new WebSocket(`ws://localhost:5000/telemetry`);

function send(message) {
  socket.send(JSON.stringify(message));
}

socket.addEventListener('open', () => {
  console.log('WS connection established');
  socketConnected = true;
  socket.send(JSON.stringify({
    type: 'status',
    message: 'Confirmed connection',
  }));
})

socket.addEventListener('message', ({ data }) => {
  console.log(data);
});

socket.addEventListener('error', (err) => {
  console.log(err);
});

socket.addEventListener('close', () => {
  console.log('WS disconnected');
  socketConnected = false;
  socket.close();
});
