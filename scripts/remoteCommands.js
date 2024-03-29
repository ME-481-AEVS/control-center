let status = 0; // 0 = normal, 1 = manual control, -1 = emergency stop
let doorOpen = false;
let controlSocketConnected;
let controlSocket;

/* Data encoded as a number, each bit represents a command:
      0000 0000
       ECO WASD
    E: emergency stop   64
    C: close door       32
    O: open door        16
    W: forward           8
    A: left              4
    S: backward          2
    D: right             1
 */
let dataState = 0;
let oldDataState = 0;

let wPress = false;
let aPress = false;
let sPress = false;
let dPress = false;

const manualControlButton = document.getElementById('manualControlButton');
const emergencyStopButton = document.getElementById('emergencyStopButton');

const statusText = document.getElementById('statusText');
const statusIcon = document.getElementById('statusCircle');
const deliveryBox = document.getElementById('currentDeliveryBox');
const manualBox = document.getElementById('manualControlBox');

const forwardControl = document.getElementById('forwardControl');
const leftControl = document.getElementById('leftControl');
const backControl = document.getElementById('backControl');
const rightControl = document.getElementById('rightControl');

function updatePage() {
  switch (status) {
    case -1: // emergency stop
      emergencyStopButton.innerText = 'RESUME OPERATION';
      statusText.style.color = '#ce0d0d';
      statusText.innerText = 'EMERGENCY STOP';
      statusIcon.style.visibility = 'hidden';
      manualControlButton.disabled = true;
      break;
    case 1: // manual control
      statusText.innerText = 'MANUAL CONTROL ON';
      statusText.style.color = '#ffc107';
      statusText.style.animation = 'blinker 2s linear infinite';
      statusIcon.style.visibility = 'hidden';
      manualControlButton.innerText = 'RELEASE CONTROL';
      deliveryBox.style.display = 'none';
      manualBox.style.display = '';
      break;
    default: // normal mode
      statusText.innerText = 'Ready';
      statusText.style.color = '#0f9d3c';
      statusText.style.animation = '';
      statusIcon.style.visibility = 'visible';
      manualControlButton.innerText = 'MANUAL CONTROL';
      deliveryBox.style.display = '';
      manualBox.style.display = 'none';
      emergencyStopButton.innerText = 'EMERGENCY STOP';
      manualControlButton.disabled = false;
  }
}

function toggleEmergencyStop() {
  // todo send command even if manual control is off
  if (status !== -1) {
    if (controlSocketConnected) {
      controlSocketConnected = false;
      controlSocket.close();
      telemSocketConnected = true;
      telemSocket = new WebSocket('wss://168.105.240.9/telemetry');
    }
    status = -1;
    dataState += 64;
    console.log('Emergency stop engaged');
    updatePage();
  } else {
    status = 0;
    dataState -= 64;
    console.log('Emergency stop disengaged');
    updatePage();
  }
}

function openDoor() {
  if (status === 1) {
    if (dataState === 0) {
      controlSocket.send(JSON.stringify({
        type: 'command',
        message: 16,
      }));
      console.log('Opening door');
      doorOpen = true;
    } else {
      alert('AEV must be stopped before operating door.');
    }
  } else {
    alert('Cannot operate door while emergency stop engaged');
  }
}

function closeDoor() {
  if (status === 1) {
    if (dataState === 0) {
      controlSocket.send(JSON.stringify({
        type: 'command',
        message: 32,
      }));
      console.log('Closing door');
      doorOpen = false;
    } else {
      alert('AEV must be stopped before operating door.');
    }
  } else {
    alert('Cannot operate door while emergency stop engaged');
  }
}

function keyDown(event) {
  if (doorOpen || status < 1) {
    return;
  }
  switch (event.key) {
    case 'w' || 'W':
      if (!wPress) {
        wPress = true;
        dataState += 8;
        forwardControl.style.color = '#0095CB';
      }
      break;
    case 'a' || 'A':
      if (!aPress) {
        aPress = true;
        dataState += 4;
        leftControl.style.color = '#0095CB';
      }
      break;
    case 's' || 'S':
      if (!sPress) {
        sPress = true;
        dataState += 2;
        backControl.style.color = '#0095CB';
      }
      break;
    case 'd' || 'D':
      if (!dPress) {
        dPress = true;
        dataState += 1;
        rightControl.style.color = '#0095CB';
      }
      break;
  }
  // send data if changed
  if (dataState !== oldDataState) {
    controlSocket.send(JSON.stringify({
      type: 'command',
      message: dataState,
    }));
    console.log(dataState);
    oldDataState = dataState;
  }
}

function keyUp(event) {
  if (doorOpen || status < 1) {
    return;
  }
  switch (event.key) {
    case 'w' || 'W':
      if (wPress) {
        wPress = false;
        dataState -= 8;
        forwardControl.style.color = '';
      }
      break;
    case 'a' || 'A':
      if (aPress) {
        aPress = false;
        dataState -= 4;
        leftControl.style.color = '';
      }
      break;
    case 's' || 'S':
      if (sPress) {
        sPress = false;
        dataState -= 2;
        backControl.style.color = '';
      }
      break;
    case 'd' || 'D':
      if (dPress) {
        dPress = false;
        dataState -= 1;
        rightControl.style.color = '';
      }
      break;
  }
  // send data if changed
  if (dataState !== oldDataState) {
    controlSocket.send(JSON.stringify({
      type: 'command',
      message: dataState,
    }));
    console.log(dataState);
    oldDataState = dataState;
  }
}

function manualControl() {
  if (status === -1) {
    // we're in emergency stop mode
    return;
  }
  if (status === 1) {
    // we're in manual control, switch back to normal
    status = 0;
    controlSocket.send(JSON.stringify({
      type: 'status',
      message: 'Manual control off',
    }));
    controlSocketConnected = false;
    controlSocket.close();
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
    updatePage();
    return;
  }
  controlSocket = new WebSocket(`wss://168.105.240.9/control`);
  controlSocket.addEventListener('open', () => {
    console.log('WS connection established');
    controlSocketConnected = true;
    controlSocket.send(JSON.stringify({
      type: 'status',
      message: 'Manual control on',
    }));
    telemSocketConnected = false;
    telemSocket.close();
  })

  controlSocket.addEventListener('message', ({ data }) => {
    console.log(data);
  });

  controlSocket.addEventListener('error', (err) => {
    console.log(err);
  });

  controlSocket.addEventListener('close', () => {
    console.log('Controls websocket disconnected');
    controlSocketConnected = false;
    controlSocket.close();
    if (!telemSocketConnected) {
      telemSocketConnected = true;
      telemSocket = new WebSocket('wss://168.105.240.9/telemetry');
    }
  });

  status = 1;
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
  updatePage();
}
