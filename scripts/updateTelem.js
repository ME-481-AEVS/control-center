let telemSocketConnected;
let telemSocket = new WebSocket('ws://168.105.240.9/telemetry');

function send(message) {
  telemSocket.send(JSON.stringify(message));
}

telemSocket.addEventListener('open', () => {
  console.log('WS connection established');
  telemSocketConnected = true;
  telemSocket.send(JSON.stringify({
    type: 'status',
    message: 'Confirmed connection',
  }));
})

telemSocket.addEventListener('message', ({ data }) => {
  console.log(data);
});

telemSocket.addEventListener('error', (err) => {
  console.log(err);
});

telemSocket.addEventListener('close', () => {
  console.log('Telemetry socket disconnected');
  telemSocketConnected = false;
  telemSocket.close();
});
