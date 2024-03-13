// Stores the active TCP connection object.
let connection;
let intervalId = null;
let moveDir;
let speed = 1;
let currDir = null;

const handleUserInput = function (data) {
  console.log(data, '\r');

  const move = (newSpeed = speed) => {
    if (intervalId !== null && speed === newSpeed) return;
    if (intervalId !== null) clearInterval(intervalId);
    if (speed !== newSpeed) speed = newSpeed;

    const delay = Math.floor(200 / speed);
    intervalId = setInterval(() => moveDir(), delay);
  };

  if (data === 'w') {
    if (data === currDir || currDir === 's') return;
    currDir = data;
    moveDir = () => connection.write('Move: up');
    move();
  }
  if (data === 'a') {
    if (data === currDir || currDir === 'd') return;
    currDir = data;
    moveDir = () => connection.write('Move: left');
    move();
  }
  if (data === 's') {
    if (data === currDir || currDir === 'w') return;
    currDir = data;
    moveDir = () => connection.write('Move: down');
    move();
  }
  if (data === 'd') {
    if (data === currDir || currDir === 'a') return;
    currDir = data;
    moveDir = () => connection.write('Move: right');
    move();
  }

  if (data === 'h') connection.write('Say: watch out!');
  if (data === 'j') connection.write("Say: comin' thru!");
  if (data === 'k') connection.write('Say: wah wah');
  if (data === 'l') connection.write('Say: who dis');
  if (data === 'y') connection.write('Say: nice move!');

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
