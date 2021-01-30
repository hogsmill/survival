<template>
  <table>
    <thead>
      <tr>
        <th :colspan="gameState.length + 1" class="hint">
          Drag and drop to re-rank items
        </th>
      </tr><tr>
        <th>Overall</th>
        <th v-for="player in gameState" :key="'h-' + player.name.id">
          <h2>{{ player.name.name }}</h2>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div v-for="item in sortedItems" :key="item.item" class="sorted-items">
            {{ item.item }}
            <div>{{ item.score / gameState.length }}</div>
          </div>
        </td>
        <td v-for="player in gameState" :key="'b-' + player.name.id">
          <draggable v-if="player.name.id == myName.id" v-model="player.items" group="items" @start="drag=true" @end="end(player.items)">
            <div v-for="item in player.items" :key="item.item">
              {{ item.item }}
            </div>
          </draggable>
          <div v-if="player.name.id != myName.id">
            <div v-for="item in player.items" :key="item.item">
              {{ item.item }}
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: [
    'socket'
  ],
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
  },
  methods: {
    end(items) {
      this.socket.emit('updateItems', {gameName: this.gameName, player: this.myName, items: items})
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
        border-radius: 6px;
        box-shadow: 3px 3px 4px #444;
        margin: 4px;
        padding: 6px;
        background-color: #fff;
        opacity: 0.9;
      }

      .sorted-items {
        background-color: green;
        color: #fff;

        div {
          background-color: red;
          float: right;
          height: 26px;
          width: 26px;
          border-radius: 13px;
          text-align: center;
          padding: 0;
          margin-top: 0;
        }
      }
    }
  }

</style>
