import net from 'net';
(async () => {

  const address = "192.168.1.10";
  const port = "80";

  const socket = new net.Socket();
  socket.connect(port, address, () => {
    console.log(`MKS socket connected to ${address}:${port}`);
  
  });

  socket.on('data', (...args) => {
    console.log(...args);
  });

  setInterval(() => {}, 1000);

})();
