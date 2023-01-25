const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map();

const players = {
  one: {
    connected: false,
    id: null
  },
  two: {
    connected: false,
    id: null
  }
}

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);

    if (!players.one.connected) {
      players.one.connected = true;
      players.one.id = { 
        number: 1,
        uuid: id
      };
      console.log('P1 Joined')
    } else if (!players.two.connected) {
      players.two.connected = true;
      players.two.id = {
        number: 2,
        uuid: id
      };
      console.log('P2 Joined');
    } else {
      console.log('Too many players.');
    }

    const playerNumber = id === players.one.id.uuid ? 1 : 2;

    const metadata = { id, color, playerNumber };

    clients.set(ws, metadata);
    
    const defuq = {
      message: "Connected",
      playerNumber
    };

    const connectMessage = JSON.stringify(defuq);

    [...clients.keys()].forEach((client) => {
      client.send(connectMessage);
    });

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);

        console.log('meta data', metadata);
  
        
        // message.sender = metadata.id;
        // message.color = metadata.color;
        // message.player = metadata.id === players.one.id ?? players.one.id
        // message.player = metadata.id === players.two.id ?? players.two.id

        console.log('MSG:', message);

        console.log(players);

        const outbound = JSON.stringify({message, playerNumber});

        [...clients.keys()].forEach((client) => {
          client.send(outbound);
        });
      });

      ws.on("close", () => {
        clients.delete(ws);
      });
  });

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  console.log("wss up", wss.address());
  