<template>
  <div class="rounded solution">
    <h3>Score</h3>
    <h4>You scored {{ score() }}/5 ({{ percentage() }}%)</h4>
    <h3>Rationale</h3>
    <p>
      According to the experts (US Coastguard), the basic supplies needed
      when a person is stranded mid-ocean are articles to attract attention
      and articles to aid survival until rescue arrives. Articles for navigation
      are of little importance since even if a small life raft were capable of
      reaching land, it would be impossible to store enough food and water
      to survive for the requisite amount of time.
    </p>
    <p>
      Without signaling devices, there is almost no chance of being spotted
      and ultimately rescued. Furthermore, most rescues occur within the
      first 36 hours and a person can survive with only a minimum of food
      and water during that period.
    </p>
    <p>
      So, the following is the order of ranking the items in their importance
      to your survival:
    </p>
    <table>
      <thead>
        <tr>
          <th>Your Rank</th>
          <th>Coastguard Rank</th>
          <th>Item</th>
          <th>Rationale</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="{'selected': item.order <= 5 && item.rank > 5, 'correct': item.order <= 5 && item.rank <= 5}" v-for="item in rankedItems()" :key="item.order">
          <td class="rank">
            {{ item.rank }}
          </td>
          <td class="rank">
            {{ item.order }}
          </td>
          <td>{{ item.item }}</td>
          <td>{{ item.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$store.getters.getItems
    }
  },
  methods: {
    percentage() {
      return this.score() / 5 * 100
    },
    score() {
      let s = 0
      const items = this.rankedItems()
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items.length; j++) {
          if (items[i].item == items[j].item && items[i].rank <= 5 && items[j].order <= 5) {
            s = s + 1
          }
        }

      }
      return s
    },
    itemRank(item, items) {
      let rank = 0
      for (let i = 0; i < items.length; i++) {
        if (item.item == items[i].item) {
          rank = i
        }
      }
      return rank + 1
    },
    rankedItems() {
      const itemsRanked = []
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        item.rank = this.itemRank(item, this.items)
        itemsRanked.push(item)
      }
      return itemsRanked.sort(function(a, b) { return a.order - b.order})
    }
  }
}
</script>

<style lang="scss">

  .solution {
    margin: 0 auto;
    width: 80%;
    background-color: #fff;
    padding: 12px;

    .correct {
      td {
        background-color: green;
        color: #fff;
      }
    }

    .selected {
      td {
        background-color: cornflowerblue;
        color: #fff;
      }
    }

    .rank {
      text-align: center;
    }

    th {
      background-color: #888;
      padding: 4px;
    }
    td {
      text-align: left;
      vertical-align: top;
      border: 1px solid #ccc;
      padding: 4px;
    }
  }

</style>
