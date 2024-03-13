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
  } // w
  if (data === 'a') {
    if (data === currDir || currDir === 'd') return;
    currDir = data;
    moveDir = () => connection.write('Move: left');
    move();
  } // a
  if (data === 's') {
    if (data === currDir || currDir === 'w') return;
    currDir = data;
    moveDir = () => connection.write('Move: down');
    move();
  } // s
  if (data === 'd') {
    if (data === currDir || currDir === 'a') return;
    currDir = data;
    moveDir = () => connection.write('Move: right');
    move();
  }
  // d

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
