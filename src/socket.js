import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3011'
} else {
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// --- Send ---

bus.on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.on('sendStartGame', (data) => { socket.emit('sendStartGame', data) })

bus.on('sendAddPlayer', (data) => { socket.emit('sendAddPlayer', data) })

bus.on('sendUpdateItems', (data) => { socket.emit('sendUpdateItems', data) })

bus.on('sendEndGame', (data) => { socket.emit('sendEndGame', data) })

// --- Receive ---

socket.on('loadGame', (data) => { bus.emit('loadGame', data) })

socket.on('startGame', (data) => { bus.emit('startGame', data) })

socket.on('endGame', (data) => { bus.emit('endGame', data) })

socket.on('updateGameState', (data) => { bus.emit('updateGameState', data) })

socket.on('updateItems', (data) => { bus.emit('updateItems', data) })

socket.on('updateConnections', (data) => { bus.emit('updateConnections', data) })

export default bus
