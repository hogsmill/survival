<template>
  <div class="end-game">
      <button class="name btn btn-sm btn-secondary smaller-font"  @click="endGame()">Finish Ranking</button>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    endGame() {
      this.socket.emit("endGame", {gameName: this.gameName})
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
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
