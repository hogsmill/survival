<template>

  <table>
    <thead>
      <tr>
        <th :colspan="gameState.length + 1" class="hint">Drag and drop to re-rank items</th>
      <tr>
        <th>Overall</th>
        <th v-for="player in gameState" :key="'h-' + player.name.id"><h2>{{ player.name.name }}</h2></th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td>
        <div v-for="item in sortedItems" :key="item.item" class="sorted-items">{{ item.item }} {{item.score / gameState.length}}</div>
      </td>
      <td v-for="player in gameState" :key="'b-' + player.name.id">
        <draggable v-if="player.name.id == myName.id" v-model="player.items" group="items" @start="drag=true" @end="end(player.items)">
          <div v-for="item in player.items" :key="item.item" @click="select(item, player)">{{ item.item }}</div>
        </draggable>
        <div v-if="player.name.id != myName.id">
          <div v-for="item in player.items" :key="item.item" @click="select(item, player)">{{ item.item }}</div>
        </div>
      </td>
      </tr>
    </tbody>
  </table>

</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: [
    'socket'
  ],
  components: {
    draggable
  },
  methods: {
    end(items) {
      this.socket.emit("updateItems", {gameName: this.gameName, player: this.myName, items: items})
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    sortedItems() {
      return this.$store.getters.getItemsSorted
    }
  }
}
</script>

<style lang="scss">

  table {
    width: 80%;
    margin: 0 auto;

    th {
      color: #fff;

      &.hint {
        font-weight: normal;
        font-style: italic;
      }
    }

    td {

      div div, .sorted-items {
        border-radius: 12px;
        margin: 4px;
        background-color: #fff;
        opacity: 0.9;
      }

      .sorted-items {
        background-color: green;
        color: #fff;
      }
    }
  }

</style>
