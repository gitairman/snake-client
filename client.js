const net = require('net');

// establishes a connection with the game server
const connect = function () {
  const conn = net.createConnection({
    host: 'localhost',
    port: 50541,
  });

  // interpret incoming data as text
  conn.setEncoding('utf8');

  conn.on('connect', () => {
    console.log(`Connected to server!`);
    conn.write('Name: AEH');
  });
  conn.on('connect', () => {
    console.log('Start playing!');
  });

  conn.on('data', (data) => {
    console.log('Server says: ', data);
    if (data.includes('ded')) process.exit();
  });

  return conn;
};

module.exports = connect;
