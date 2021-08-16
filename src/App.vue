<template>
  <div id="app" class="mb-4">
    <appHeader />
    <ClearStorage />
    <WalkThroughView />
    <div v-if="!showAbout" class="main">
      <div v-if="isHost" class="connections">
        Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
      </div>
      <div class="names">
        <GameName />
        <MyName />
        <EndGame v-if="gameStarted && !gameFinished" />
      </div>
      <div class="container">
        <div class="row">
          <Intro v-if="!gameStarted && !gameFinished" />
          <Board v-if="gameStarted && !gameFinished" />
          <Solution v-if="gameStarted && gameFinished" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'

import Header from './components/Header.vue'
import ClearStorage from './components/ClearStorage.vue'
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
    ClearStorage,
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
      return this.$store.getters.getGameStarted
    },
    gameFinished() {
      return this.$store.getters.getGameFinished
    },
    connections() {
      return this.$store.getters.getConnections
    }
  },
  created() {
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
      bus.$emit('sendLoadGame', {gameName: gameName})
      this.$store.dispatch('updateGameName', gameName)
    }

    bus.$on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
        if (myName && gameName) {
          bus.$emit('sendAddPlayer', {gameName: gameName, player: myName})
        }
      }
    })

    bus.$on('startGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('startGame', true)
      }
    })

    bus.$on('endGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('endGame', true)
      }
    })

    bus.$on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    bus.$on('updateItems', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateItems', data)
      }
    })

    bus.$on('updateConnections', (data) => {
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
