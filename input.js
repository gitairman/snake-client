const {
  MOVE_UP_KEY,
  MOVE_DOWN_KEY,
  MOVE_LEFT_KEY,
  MOVE_RIGHT_KEY,
} = require('./constants');

// Stores the active TCP connection object.
let connection;
let intervalId = null;
let moveDir;
let speed = 1;
let currDir = null;

const handleDirChange = (newDir, oppDir, command) => {
  if (newDir === currDir || currDir === oppDir) return;
  currDir = newDir;
  moveDir = () => connection.write(command);
  move();
};

const move = (newSpeed = speed) => {
  if (intervalId !== null && speed === newSpeed) return;
  if (intervalId !== null) clearInterval(intervalId);
  if (speed !== newSpeed) speed = newSpeed;

  const delay = Math.floor(200 / speed);
  intervalId = setInterval(() => moveDir(), delay);
};

const handleUserInput = function (data) {
  console.log(data, '\r');

  if (data === MOVE_UP_KEY) {
    handleDirChange(data, 's', 'Move: up');
  }
  if (data === MOVE_LEFT_KEY) {
    handleDirChange(data, 'd', 'Move: left');
  }
  if (data === MOVE_DOWN_KEY) {
    handleDirChange(data, 'w', 'Move: down');
  }
  if (data === MOVE_RIGHT_KEY) {
    handleDirChange(data, 'a', 'Move: right');
  }

  if (data === 'h') connection.write('Say: watch out!');
  if (data === 'j') connection.write("Say: Aaron comin' thru!");
  if (data === 'k') connection.write('Say: wah wah');
  if (data === 'l') connection.write('Say: who dis');
  if (data === 'b') connection.write('Say: nice move!');
  if (data === 'n') connection.write('Say: too slow');
  if (data === 'm') connection.write('Say: catch me if you can!');
  if (data === 'y') connection.write('Say: Hi Amrinder!');
  if (data === 'u') connection.write('Say: Hi Anim!');
  if (data === 'i') connection.write('Say: Hi Lily!');
  if (data === 'o') connection.write('Say: Hi Jasjot!');

  if (Number(data) >= 1 && Number(data) <= 9) move(Number(data));

  if (data === '\u0003') process.exit();
};

// setup interface to handle user input from stdin

const setupInput = function (conn) {
  connection = conn;
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.resume();

  stdin.on('data', handleUserInput);

  return stdin;
};

module.exports = setupInput;
