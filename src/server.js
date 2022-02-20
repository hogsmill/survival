const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const port = prod ? process.env.VUE_APP_PORT : 3011
const logFile = prod ? process.argv[4] : 'server.log'
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'survival'

ON_DEATH((signal, err) => {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, (err) => {
    if (err) console.log(logStr)
    process.exit()
  })
})

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/agilesimulations.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 50

const emit = (event, data) => {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err
  const db = client.db('db')

  db.createCollection(gameCollection, (error, collection) => {})

  db.gameCollection = db.collection(gameCollection)

  io.on('connection', (socket) => {
    connections = connections + 1
    if (connections > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      connections = connections - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn) })

    socket.on('sendAddPlayer', (data) => { dbStore.addPlayer(db, io, data, debugOn) })

    socket.on('sendStartGame', (data) => { emit('startGame', data) })

    socket.on('sendUpdateItems', (data) => { dbStore.updateItems(db, io, data, debugOn) })

    socket.on('sendEndGame', (data) => { emit('endGame', data) })
  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
