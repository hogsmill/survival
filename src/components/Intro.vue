<template>
  <div class="rounded instructions">
    <h3>Welcome to Survival at Sea</h3>
    <p>
      You and your team have chartered a yacht. None of you have any previous sailing
      experience, and you have hired an experienced skipper and two-person crew. As you
      sail through the Southern Pacific Ocean a fire breaks out and much of the yacht and its
      contents are destroyed.
    </p>
    <p><em>The yacht is slowly sinking...</em></p>
    <p>
      Your location is unclear because vital navigational and radio equipment has been
      damaged. The yacht skipper and crew have been lost whilst trying to fight the fire. Your
      best estimate is that you are approximately 1000km South West of the nearest landfall.
    </p>
    <p>You and your friends have managed to save the following 15 items, undamaged and intact after the fire.</p>
    <ul>
      <li v-for="item in items" :key="item.order">
        {{ item.item }}
      </li>
    </ul>
    <p>In addition, you have salvaged a four man rubber life craft and a box of matches.</p>
    <p>
      You need to rank the items in order of importance, and keep the top 5; all other items will have to
      be discarded to stop the yacht from sinking.
    </p>
    <p>
      If all the players understand the situation and the rules, one of you needs to press the button
      to start the game...
    </p>
    <div>
      <button class="btn btn-sm btn-secondary smaller-font" @click="startGame">
        Start Game
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    items() {
      return this.$store.getters.getItemsRandom
    }
  },
  methods: {
    startGame() {
      this.socket.emit('startGame', {gameName: this.gameName})
    }
  }
}
</script>

<style lang="scss">

  .instructions {
    margin: 0 auto;
    width: 80%;
    background-color: #fff;
    padding: 12px;

    ul {
      margin: 0 auto 16px auto;
      width: 60%;

      li {
        text-align: left;
      }
    }
  }
</style>
