<template>
  <div class="game-name" v-if="!showAbout">
    <button class="name btn btn-sm btn-secondary smaller-font" v-if="!gameName" @click="show">
      Set Game Name
    </button>
    <span v-if="gameName" @click="show" class="rounded name mr-2 mt-2 pointer p-2 bg-light">Game: {{ gameName }}</span>
    <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span>

    <modal name="set-game-name" :height="120" :classes="['rounded', 'set-game-name']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">
            Save
          </button>
        </div>
      </div>
    </modal>
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
    const self = this
    bus.$on('startGame', (data) => {
      self.show()
    })
  },
  methods: {
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    saveGameName: function() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      localStorage.setItem('gameName-su', gameName)
      bus.$emit('sendLoadGame', {gameName: this.gameName})
      this.hide()
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.$emit('sendRestartGame', {gameName: this.gameName})
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
.set-game-name {

  #game-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
