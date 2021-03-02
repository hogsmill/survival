<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout" class="main">
      <h1>Survival At Sea</h1>
      <div v-if="isHost" class="connections">
        Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
      </div>
      <div class="names">
        <GameName :socket="socket" />
        <MyName :socket="socket" />
        <EndGame v-if="gameStarted && !gameFinished" :socket="socket" />
      </div>
      <div class="container">
        <div class="row">
          <Intro v-if="!gameStarted && !gameFinished" :socket="socket" />
          <Board v-if="gameStarted && !gameFinished" :socket="socket" />
          <Solution v-if="gameStarted && gameFinished" :socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'

import GameName from './components/GameName.vue'
import MyName from './components/MyName.vue'
import EndGame from './components/EndGame.vue'
import Intro from './components/Intro.vue'
import Board from './components/Board.vue'
import Solution from './components/Solution.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    WalkThroughView,
    GameName,
    MyName,
    EndGame,
    Intro,
    Board,
    Solution
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    myName() {
      return this.$store.getters.getMyName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    gameStarted() {
      //return true
      return this.$store.getters.getGameStarted
    },
    gameFinished() {
      //return true
      return this.$store.getters.getGameFinished
    },
    connections() {
      return this.$store.getters.getConnections
    }
  },
  created() {
    let connStr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3011'
    } else {
      connStr = 'https://agilesimulations.co.uk:3011'
    }
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    let myName = localStorage.getItem('myName-su')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('setMyName', myName)
    }

    const gameName = localStorage.getItem('gameName-su')
    if (gameName) {
      this.socket.emit('loadGame', {gameName: gameName})
      this.$store.dispatch('updateGameName', gameName)
    }

    if (myName && gameName) {
      this.socket.emit('addPlayer', {gameName: gameName, player: myName})
    }

    this.socket.on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    this.socket.on('startGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('startGame', true)
      }
    })

    this.socket.on('endGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('endGame', true)
      }
    })

    this.socket.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    this.socket.on('updateItems', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateItems', data)
      }
    })

    this.socket.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  },
  methods: {
  }
}
</script>

<style lang="scss">

  body {
    background-image: url("./assets/img/sea.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 700px;
  }

  h1, h2 {
    color: #fff;
  }

  .connections {
    text-align: right;
    padding-right: 6px;
    margin-bottom: 12px;
  }

  .main {
    position: relative;

    .names {
      height: 50px;
      text-align: center;
    }
  }

</style>
