let manualControlsOn = false;
let doorOpen = false; // todo get this from robot

/* Data encoded as a number, each bit represents a command:
      0000 0000
        CO WASD
    C: close door
    O: open door
    W: forward
    A: left
    S: backward
    D: right
 */
let dataState = 0;
let oldDataState = 0;

let wPress = false;
let aPress = false;
let sPress = false;
let dPress = false;

const statusText = document.getElementById('statusText');
const statusIcon = document.getElementById('statusCircle');
const manualControlButton = document.getElementById('manualControlButton');
const deliveryBox = document.getElementById('currentDeliveryBox');
const manualBox = document.getElementById('manualControlBox');

const forwardControl = document.getElementById('forwardControl');
const leftControl = document.getElementById('leftControl');
const backControl = document.getElementById('backControl');
const rightControl = document.getElementById('rightControl');

function openDoor() {
  if (manualControlsOn) {
    if (dataState === 0) {
      // TODO send the command (32)
      console.log('Opening door');
      doorOpen = true;
    } else {
      alert('AEV must be stopped before operating door.');
    }
  }
}

function closeDoor() {
  if (manualControlsOn) {
    if (dataState === 0) {
      // TODO send the command (16)
      console.log('Closing door');
      doorOpen = false;
    } else {
      alert('AEV must be stopped before operating door.');
    }
  }
}

function keyDown(event) {
  if (doorOpen) {
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
    // TODO send data
    console.log(dataState);
    oldDataState = dataState;
  }
}

function keyUp(event) {
  if (doorOpen) {
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
    // TODO send data
    console.log(dataState);
    oldDataState = dataState;
  }
}

function manualControl() {
  manualControlsOn = !manualControlsOn;

  if (manualControlsOn) {
    statusText.innerText = 'MANUAL CONTROLS ON';
    statusText.style.color = '#ffc107';
    statusText.style.animation = 'blinker 2s linear infinite';
    statusIcon.style.visibility = 'hidden';
    manualControlButton.innerText = 'RELEASE CONTROL';
    deliveryBox.style.display = 'none';
    manualBox.style.display = '';

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
  } else {
    statusText.innerText = 'Ready';
    statusText.style.color = '#0f9d3c';
    statusText.style.animation = '';
    statusIcon.style.visibility = 'visible';
    manualControlButton.innerText = 'MANUAL CONTROL';
    deliveryBox.style.display = '';
    manualBox.style.display = 'none';

    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
  }
}
