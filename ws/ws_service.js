const WebSocket = require('ws')
const { createServer } = require('http')

const server = createServer()

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
  console.log(`new connection`)

  ws.on('message', function incoming(message) {
    // ws.send(JSON.stringify({ message }))
    console.log(message);
  })
  // setInterval(() => {
  //   ws.send(JSON.stringify({ message: 'hello world' }))
  // }, 2000)
})

server.listen(process.env.WS_PORT)
console.log('WS Server is running on:', process.env.WS_PORT)
