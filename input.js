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

const actions = {
  [MOVE_UP_KEY]: (data) => handleDirChange(data, 's', 'Move: up'),
  [MOVE_DOWN_KEY]: (data) => handleDirChange(data, 'w', 'Move: down'),
  [MOVE_LEFT_KEY]: (data) => handleDirChange(data, 'd', 'Move: left'),
  [MOVE_RIGHT_KEY]: (data) => handleDirChange(data, 'a', 'Move: right'),
};

const msgs = {
  h: 'Say: watch out!',
  j: "Say: choo choo aaron comin' thru!",
  k: 'Say: wah wah',
  l: 'Say: who dis?',
  y: 'Say: hi Amrinder!',
  u: 'Say: hi Anim!',
  i: 'Say: hi Lily!',
  o: 'Say: hi Jasjot!',
  b: 'Say: nice move!',
  n: 'Say: too slow',
  m: 'Say: catch me if you can!',
};

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

  if (actions[data]) actions[data](data);

  if (msgs[data]) connection.write(msgs[data]);

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
