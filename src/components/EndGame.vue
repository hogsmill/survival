<template>
  <div class="end-game">
    <button class="name btn btn-sm btn-secondary smaller-font" @click="endGame()">
      Finish Ranking
    </button>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    endGame() {
      bus.emit('sendEndGame', {gameName: this.gameName})
    }
  }
}
</script>

<style lang="scss">

  .end-game {
    width: 120px;
    display: inline-block;
  }

</style>
