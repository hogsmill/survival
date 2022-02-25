<template>
  <div>
    <button v-if="walkThrough && !showAbout" class="btn btn-sm btn-info" @click="help">
      Explain this for me...
    </button>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    if (params.isParam('walkThrough')) {
      this.$store.dispatch('updateWalkThrough', true)
      this.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    help() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>

<style lang="scss">

  .buttons {
    padding: 6px;
  }

  #walk-through p {
    margin-left: 8px;
    margin-right: 8px;
  }

  .walkthrough-button {
    background-color: #6c757d;
    width: 150px;
    color: #fff;
    padding: .25rem .5rem;
    margin: 0 auto 12px auto;
  }

</style>
