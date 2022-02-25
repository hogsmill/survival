<template>
  <div class="game-name" v-if="!showAbout">
    <button class="name btn btn-sm btn-secondary smaller-font" v-if="!gameName" @click="show">
      Set Game Name
    </button>
    <span v-if="gameName" @click="show" class="rounded name mr-2 mt-2 pointer p-2 bg-light">Game: {{ gameName }}</span>
    <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  created() {
    bus.on('startGame', (data) => {
      this.show()
    })
  },
  methods: {
    show () {
      this.$store.dispatch('showModal', 'setGameName')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.emit('sendRestartGame', {gameName: this.gameName})
      }
    }
  },
}
</script>

<style lang="scss">
  .game-name {
    width: 200px;
    display: inline-block;

    .restart:hover {
      cursor: pointer;
    }
  }
</style>
